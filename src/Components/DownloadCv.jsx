import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { RiGeminiLine } from "react-icons/ri";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  AlignmentType
} from "docx";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js"
import apiService from "../services/api.js";
import OpenAI from "openai";

const recordIdSecret = import.meta.env.VITE_RECORDID_SECRET;
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const DoctorCV = () => {
  const { encryptedProfileId } = useParams();
  const [generateCVData, setGenerateCVData] = useState({})
  const [loading, setLoading] = useState(false);
  const [cvReady, setCvReady] = useState(false);
  const [active, setActive] = useState('Preview');
  const [isCvGenerated, setIsCvGenerated] = useState(false);
  

  const decryptRecordId = (encryptedRecordId) => {
    const bytes = CryptoJS.AES.decrypt(encryptedRecordId, recordIdSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const profileId = decryptRecordId(encryptedProfileId);
  
  useEffect (()=>{
    console.log("Profile Id of the doctor in the Download CV", profileId)
     setCvReady(false);
  },[profileId])

  

  const handleGenerateCV = async () => {
    setLoading(true)
    try {
      const response = await apiService.profiles.generateCV(profileId);
      const rawData = response.data;

      const doctorData = {
        name: rawData.Full_Name !== "NaN" ? rawData.Full_Name : '',
        title: rawData.HCP_Speciality_1 !== "NaN" ? rawData.HCP_Speciality_1 : '',
        phone: rawData.phone !== "NaN" ? rawData.phone : '',
        email: rawData.HCP_Email_1 !== "NaN" ? rawData.HCP_Email_1 : '',
        address: rawData.Address_1 !== "NaN" ? rawData.Address_1 : '',
        photoUrl: rawData.Profile_Pic_Link !== "NaN" ? rawData.Profile_Pic_Link : '',
        summary: '',
        expertise: ["", "", "", "", ""],
        education: [
          {
            degree: rawData?.Degree_1 !== "NaN" ? rawData?.Degree_1 : "",
            year: rawData?.Graduation_Year_1 !== "NaN" ? rawData?.Graduation_Year_1 : "",
            institution: rawData?.Institution1 !== "NaN" ? rawData?.Institution1 : "",
          },
          {
            degree: rawData?.Degree_2 !== "NaN" ? rawData?.Degree_2 : "",
            year: rawData?.Graduation_Year_2 !== "NaN" ? rawData?.Graduation_Year_2 : "",
            institution: rawData?.Institution2 !== "NaN" ? rawData?.Institution2 : "",
          },
          {
            degree: rawData?.Degree_3 !== "NaN" ? rawData?.Degree_3 : "",
            year: rawData?.Graduation_Year_3 !== "NaN" ? rawData?.Graduation_Year_3 : "",
            institution: rawData?.Institution3 !== "NaN" ? rawData?.Institution3 : "",
          },
        ],
        licenseNumber: '',
        affiliations: [
          rawData.College_1 !== "NaN" ? rawData.College_1 : "",
          rawData.College_2 !== "NaN" ? rawData.College_2 : "",
          rawData.College_3 !== "NaN" ? rawData.College_3 : "",
          rawData.college_4 !== "NaN" ? rawData.college_4 : "",
        ],
        publications: Array.isArray(rawData?.publications) ? rawData.publications.map(p => typeof p === 'string' ? p
        : (p?.title || p?.name || JSON.stringify(p))) : [],
        congress: Array.isArray(rawData?.congress) ? rawData.congress.map(c => typeof c === 'string' ? c : (c?.title || c?.name || JSON.stringify(c))) : [],
        members: ["", ""],
        academicMembers: ["", ""],
        clinicalTrials: Array.isArray(rawData?.clinical_trails) ? rawData.clinical_trails.map(c => typeof c === 'string' ? c : (c?.title || c?.name || JSON.stringify(c))) : [],
        guidelines: Array.isArray(rawData?.guidelines) ? rawData.guidelines.map(g => typeof g === 'string' ? g : (g?.title || g?.name || JSON.stringify(g))) : [],
      };

      const hasRealData = Object.values(doctorData).some((v) => {
        if (Array.isArray(v)) return v.some(item => item && typeof item === 'string' && item.trim() !== "");
        return v && typeof v === 'string' && v.trim() !== "";
      });

      if (!hasRealData) {
        console.log("No real data. Leaving fields empty:", doctorData);
        setGenerateCVData(doctorData);
        // setCvReady(true)
      } else {
        const filledFields = await fillMissingDoctorFields(doctorData);
        const finalDoctorData = { ...doctorData, ...filledFields };
        console.log("Merged data (original + AI):", finalDoctorData);
        setGenerateCVData(finalDoctorData);
        setCvReady(true)
      }
    } catch (err) {
      console.error("Error fetching CV data:", err);
    } finally {
      setLoading(false)
    }
  };

  const fillMissingDoctorFields = async (doctor) => {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true
    });

    const missingFields = Object.entries(doctor)
      .filter(([_, value]) => !value || (Array.isArray(value) && value.every(v => !v)))
      .map(([key]) => key);

    const prompt = `You are generating a professional CV for a doctor. Some fields are missing.

IMPORTANT RULES:
- Fill in missing fields realistically based on public and professional data available for doctors of this background.
- You are allowed to generate realistic placeholders for private fields such as phone number, email, and registration number only if they are contextually appropriate.
- If you cannot generate something sensible, leave it as an empty string.

Partial data:
${JSON.stringify(doctor, null, 2)}

Return a JSON object with only these missing fields filled: ${missingFields.join(", ")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const aiText = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      console.warn("Bad AI JSON:", aiText);
      return {};
    }

    const sanitized = {};
    for (const key of missingFields) {
      const value = parsed[key];
      if (typeof value === "string" || Array.isArray(value)) {
        sanitized[key] = value;
      } else {
        sanitized[key] = "";
      }
    }

    return sanitized;
  };

  // Utility function to safely convert to string and check if empty
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'string' ? value : String(value);
    return str.trim();
  };

  // Utility function to check if a value is valid (not empty)
  const isValidValue = (value) => {
    const str = safeString(value);
    return str !== '' && str !== 'null' && str !== 'undefined' && str !== 'NaN';
  };

  const generateWordDocument = async () => {
    if (!generateCVData || typeof generateCVData !== 'object') {
  console.warn("CV data not ready or invalid", generateCVData);
  return;
}

    
    try {
      const doctorData = generateCVData;
      
      // Create document children array
      const children = [];

      
    // Helper function to fetch image as buffer
    // const fetchImageBuffer = async (imageUrl) => {
    //   try {
    //     const response = await fetch(imageUrl);
    //     if (!response.ok) throw new Error('Failed to fetch image');
    //     const arrayBuffer = await response.arrayBuffer();
    //     return new Uint8Array(arrayBuffer);
    //   } catch (error) {
    //     console.error('Error fetching image:', error);
    //     return null;
    //   }
    // };

    // Add profile image if available
    // let profileImageBuffer = null;
    // if (isValidValue(doctorData.photoUrl)) {
    //   profileImageBuffer = await fetchImageBuffer(doctorData.photoUrl);
    // }
     // Create header section with name, title, and image
    // const headerChildren = [];

    // Add profile image to the right side if available
    // if (profileImageBuffer) {
    //   headerChildren.push(
    //     new Paragraph({
    //       children: [
    //         new ImageRun({
    //           data: profileImageBuffer,
    //           transformation: {
    //             width: 120,
    //             height: 120,
    //           },
    //         })
    //       ],
    //       alignment: AlignmentType.RIGHT,
    //       spacing: { after: 200 }
    //     })
    //   );
    // }

      // Add name if available
      if (isValidValue(doctorData.name)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: safeString(doctorData.name),
                bold: true,
                size: 32,
                color: "871787"
              })
            ],
            // alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        );
      }

      // Add title if available
      if (isValidValue(doctorData.title)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: safeString(doctorData.title),
                italics: true,
                size: 26
              })
            ],
            // alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          })
        );
      }

      // children.push(...headerChildren)

      // Contact Information Section
      const contactChildren = [];
      if (isValidValue(doctorData.email)) {
        contactChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true, size: 24 }),
              new TextRun({ text: safeString(doctorData.email), size: 24 })
            ],
            spacing: { after: 100 }
          })
        );
      }
      if (isValidValue(doctorData.phone)) {
        contactChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Phone: ", bold: true, size: 24 }),
              new TextRun({ text: safeString(doctorData.phone), size: 24 })
            ],
            spacing: { after: 100 }
          })
        );
      }
      if (isValidValue(doctorData.address)) {
        contactChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Address: ", bold: true, size: 24 }),
              new TextRun({ text: safeString(doctorData.address), size: 24 })
            ],
            spacing: { after: 100 }
          })
        );
      }

      if (contactChildren.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "CONTACT INFORMATION",
                bold: true,
                size: 28,
                color: "800080"
              })
            ],
            spacing: { before: 400, after: 200 }
          })
        );
        children.push(...contactChildren);
      }

      // Profile Section
      if (isValidValue(doctorData.summary)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFILE",
                bold: true,
                size: 28,
                color: "800080"
              })
            ],
            spacing: { before: 400, after: 200 }
          })
        );
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: safeString(doctorData.summary),
                size: 24
              })
            ],
            spacing: { after: 300 }
          })
        );
      }

      // Area of Expertise
      const validExpertise = doctorData.expertise.filter(item => isValidValue(item));
      if (validExpertise.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "AREA OF EXPERTISE",
                bold: true,
                size: 28,
                color: "800080"
              })
            ],
            spacing: { before: 400, after: 200 }
          })
        );
        validExpertise.forEach(item => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${safeString(item)}`,
                  size: 24
                })
              ],
              spacing: { after: 100 }
            })
          );
        });
      }

      // Education Section
      const validEducation = doctorData.education.filter(edu => 
        isValidValue(edu.degree) || isValidValue(edu.year) || isValidValue(edu.institution)
      );

      if (validEducation.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                size: 28,
                color: "800080"
              })
            ],
            spacing: { before: 400, after: 200 }
          })
        );

        validEducation.forEach(edu => {
          const eduParts = [];
          if (isValidValue(edu.degree)) {
            eduParts.push(safeString(edu.degree));
          }
          if (isValidValue(edu.year)) {
            eduParts.push(`(${safeString(edu.year)})`);
          }
          if (isValidValue(edu.institution)) {
            eduParts.push(`- ${safeString(edu.institution)}`);
          }

          if (eduParts.length > 0) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: eduParts.join(' '),
                    size: 24
                  })
                ],
                spacing: { after: 150 }
              })
            );
          }
        });
      }

      // Registration Section
      if (isValidValue(doctorData.licenseNumber)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "REGISTRATION",
                bold: true,
                size: 28,
                color: "800080"
              })
            ],
            spacing: { before: 400, after: 200 }
          })
        );
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: safeString(doctorData.licenseNumber),
                size: 24
              })
            ],
            spacing: { after: 100 }
          })
        );
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Medical Council of India",
                size: 24
              })
            ],
            spacing: { after: 200 }
          })
        );
      }

      // Helper function to add list sections
      const addListSection = (title, items) => {
        const validItems = items.filter(item => isValidValue(item));
        if (validItems.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 28,
                  color: "800080"
                })
              ],
              spacing: { before: 400, after: 200 }
            })
          );
          validItems.forEach(item => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${safeString(item)}`,
                    size: 24
                  })
                ],
                spacing: { after: 100 }
              })
            );
          });
        }
      };

      // Add all list sections
      addListSection("AFFILIATIONS", doctorData.affiliations);
      addListSection("PUBLICATIONS", doctorData.publications);
      addListSection("CONGRESS", doctorData.congress);
      addListSection("MEMBERS", doctorData.members);
      addListSection("ACADEMIC MEMBERS", doctorData.academicMembers);
      addListSection("CLINICAL TRIALS", doctorData.clinicalTrials);
      addListSection("GUIDELINES", doctorData.guidelines);

      // Add disclaimer
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "DISCLAIMER",
              bold: true,
              size: 24,
              color: "FF0000"
            })
          ],
          spacing: { before: 600, after: 200 }
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "⚠️ CAUTION: This CV was generated using OpenAI technology. Some information may have been automatically generated or enhanced. Please verify all details for accuracy before use. It is recommended to review and update all information to ensure it reflects current and correct professional details.",
              size: 24,
              color: "8B0000",
              
            })
          ],
          spacing: { after: 100 }
        })
      );

      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: children
          }
        ]
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      const fileName = isValidValue(doctorData.name) 
        ? `${safeString(doctorData.name).replace(/[^a-zA-Z0-9]/g, "_")}_CV.docx`
        : "Doctor_CV.docx";
      
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Error generating document. Please try again.");
    }
  };

  return (
    <div className="">
      {!cvReady ? (
        <button
          onClick={handleGenerateCV}
          disabled={loading}
          className={`bg-[#800080] flex items-center gap-2 text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-800 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}`}
        > 
          <RiGeminiLine size={20}/>
          {loading ? "Generating CV...." : "Generate CV"}
        </button>
      ) : (
        <button
          onClick={generateWordDocument}
          className="inline-flex items-center gap-3 bg-[#790979] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Download size={24} />
          Download CV
        </button>
      )}
    </div>
  );
};

export default DoctorCV;