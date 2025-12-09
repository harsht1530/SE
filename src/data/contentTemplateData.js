/**
 * Content Template Data Structure
 * This file contains all hardcoded data for content selection and templates.
 * Easy to integrate with API later - just replace the data source.
 */

// Topics with details
export const TOPICS = [
  {
    id: 'vitiligo',
    name: 'Vitiligo',
    description: 'A chronic skin condition characterized by depigmented patches',
    details: 'Vitiligo is a long-term skin condition causing light patches on the skin. It results from the loss of pigment-producing cells called melanocytes.',
    icon: '🩹'
  },
  {
    id: 'csu',
    name: 'Chronic Spontaneous Urticaria (CSU)',
    description: 'A chronic skin condition causing itchy hives and angioedema',
    details: 'CSU is characterized by the recurrent appearance of wheals (hives) and/or angioedema for more than 6 weeks without an identifiable cause.',
    icon: '🔴'
  },
  {
    id: 'ulcer',
    name: 'Peptic Ulcer',
    description: 'An open sore in the stomach or small intestine lining',
    details: 'Peptic ulcers are sores that develop on the inner lining of the stomach, small intestine, or sometimes the esophagus. They can cause pain and bleeding.',
    icon: '🩺'
  }
];

// Email Templates per topic
export const EMAIL_TEMPLATES = {
  vitiligo: [
    {
      id: 'email-vitiligo-1',
      subject: 'New Treatment Options for Vitiligo',
      body: `Dear Healthcare Professional,

We are excited to share new advancements in vitiligo treatment that have shown promising results in recent clinical studies.

Our latest therapeutic approach combines topical and systemic treatments to improve pigmentation restoration and quality of life for patients.

Key Benefits:
- Higher success rate in pigmentation restoration
- Improved patient compliance
- Enhanced safety profile

We would appreciate the opportunity to discuss how these innovations can benefit your patient population.

Best regards,
Medical Solutions Team`
    },
    {
      id: 'email-vitiligo-2',
      subject: 'Vitiligo Management: Best Practices Webinar',
      body: `Dear Doctor,

You are cordially invited to our upcoming webinar on comprehensive vitiligo management strategies.

Date: Next Month
Topic: Latest evidence-based approaches to vitiligo treatment
Speaker: Leading dermatologist with 20+ years of experience

This webinar will cover:
- Pathophysiology updates
- Treatment modalities comparison
- Patient case studies
- Q&A session

Register now to secure your spot!

Warm regards,
Medical Education Team`
    },
    {
      id: 'email-vitiligo-3',
      subject: 'Exclusive: Vitiligo Research Findings',
      body: `Dear Colleague,

We are pleased to share the latest research findings on vitiligo from our multicenter study.

The data demonstrates:
- 78% improvement in pigmentation with new protocol
- Reduced time to visible results
- Improved patient satisfaction scores

A detailed research paper and summary infographic are attached for your review.

For questions or further information, please don't hesitate to reach out.

Kind regards,
Research Department`
    }
  ],
  csu: [
    {
      id: 'email-csu-1',
      subject: "India's CSU Burden: How Aware Are You?",
      body: `Dear Dr. [Name],

Chronic spontaneous urticaria (CSU) affects ~1% of Indians, leading to major quality-of-life disruptions such as sleep loss and work absenteeism. India tops global urticaria DALYs at 749K, emphasizing the need for early dermatologist awareness.

How many CSU cases do you encounter weekly?

Share in our 1‑minute survey for personalized insights by clicking here: [Survey Link]

Best regards,
Novartis Medical Affairs Team`
    },
    {
      id: 'email-csu-2',
      subject: 'Real-World CSU Challenges in India',
      body: `Dear Dr. [Name],

CSU management usually starts with second‑generation nonsedating H1‑antihistamines (nsAHs), up‑dosed up to fourfold if needed—yet many dermatologists adapt treatment due to clinical or economic factors.

Do you identify any gaps in your practice? Vote on your top challenge and get practical tips tailored to your responses.

[Vote & Get Tips]

Regards,
Novartis Medical Affairs Team`
    },
    {
      id: 'email-csu-3',
      subject: "India's CSU Landscape: Your Perspective?",
      body: `Dear Dr. [Name],

India's CSU market is projected to grow between 2025 and 2031 amid rising prevalence, but adherence challenges persist. We are gathering clinician perspectives to identify practical steps that can improve CSU patient outcomes.

What would improve your CSU patient outcomes?

Join peers in our quick forum discussion: [Join Now]

Kind regards,
Novartis Medical Affairs Team`
    }
  ],
  ulcer: [
    {
      id: 'email-ulcer-1',
      subject: 'Peptic Ulcer Prevention and Treatment Guide',
      body: `Dear Healthcare Professional,

Updated guidelines for peptic ulcer prevention and management are now available.

Key Recommendations:
- Helicobacter pylori testing protocols
- Optimal PPI therapy duration
- Patient risk stratification
- Lifestyle modification counseling

Download the complete guideline document to integrate into your practice.

We welcome your feedback on implementation.

Best wishes,
Gastroenterology Council`
    },
    {
      id: 'email-ulcer-2',
      subject: 'Ulcer Prevention in NSAID Users',
      body: `Dear Doctor,

For patients requiring chronic NSAID therapy, effective ulcer prevention is crucial.

Our Evidence-Based Approach:
- Risk stratification tools
- Preventive pharmacotherapy options
- Monitoring protocols
- Patient education resources

Schedule a consultation to develop optimized protocols for your patient population.

Regards,
Preventive Medicine Team`
    },
    {
      id: 'email-ulcer-3',
      subject: 'New Diagnostic Technology for Peptic Ulcers',
      body: `Dear Colleague,

Advanced diagnostic imaging for peptic ulcers is now available at our partner centers.

Benefits:
- Non-invasive assessment
- High-resolution imaging
- Improved treatment planning
- Patient satisfaction

Refer your patients today for comprehensive ulcer evaluation.

Best regards,
Diagnostic Services Team`
    }
  ]
};

// WhatsApp Templates per topic
export const WHATSAPP_TEMPLATES = {
  vitiligo: [
    {
      id: 'whatsapp-vitiligo-1',
      message: `Hi 👋

Great news! We have new treatment options for Vitiligo patients. 🩹

✅ Better results
✅ Safer profile
✅ Proven effectiveness

Our latest approach has shown 78% improvement in pigmentation restoration!

Would you like to learn more? Reply YES to get more details. 📚`
    },
    {
      id: 'whatsapp-vitiligo-2',
      message: `Hello! 👩‍⚕️

Quick update on Vitiligo management:

🔄 New treatment protocol available
📊 Clinical data: 78% success rate
⏰ Faster results than traditional methods

Join our webinar next month to learn from top specialists!

Interested? Drop a message! 📨`
    },
    {
      id: 'whatsapp-vitiligo-3',
      message: `Hi there! 👋

Vitiligo patients deserve better outcomes! 

Our research shows:
✨ Improved pigmentation
✨ Enhanced quality of life
✨ Better patient satisfaction

Let's discuss how this can help your practice. Call us! ☎️`
    }
  ],
  csu: [
    {
      id: 'whatsapp-csu-1',
      message: `📈 India CSU market booming 2025-2031!

Will awareness solve adherence issues? Reply Y/N

Join the prediction poll: [Poll Link]`
    },
    {
      id: 'whatsapp-csu-2',
      message: `😱 CSU QoL IMPACT — India snapshot:
• Mental health: MCS score 36.3/100
• Physical health: PCS score 40.1/100
• 56% report moderate daily-life disruption
• 36% report mental/emotional collapse
• 31% report social/intimate relationship impact
• Angioedema in ~50%
• Anxiety linked in ~30%

How's YOUR patient QoL post‑treatment? Reply 1‑10

QoL tool + improvement guide: [link]`
    },
    {
      id: 'whatsapp-csu-3',
      message: `📈 India CSU Market & Journey:
• 2025‑2031 growth spurt expected
• ~1% prevalence (~14M patients)
• 749K DALYs (world #1)
• Guideline adherence ~25%

1990‑2021: stable ASIR/ASPR but geographic gaps
Typical pathway: GP → Dermatologist (faster dx & 2nd‑line therapy)

What's YOUR avg diagnosis time (months)? Reply with number

Market report + forum: [link]`
    }
  ],
  ulcer: [
    {
      id: 'whatsapp-ulcer-1',
      message: `Hi 👋

Peptic ulcer management guidelines updated! 📋

Now available:
✅ Prevention protocols
✅ H. pylori testing guidelines
✅ Optimal therapy strategies

Download your copy today! 📥`
    },
    {
      id: 'whatsapp-ulcer-2',
      message: `Hello 👩‍⚕️

Protecting your NSAID patients from ulcers! 💊

Our prevention program includes:
🛡️ Risk assessment tools
💉 Preventive therapy options
📊 Monitoring protocols

Interested? Let's connect! ☎️`
    },
    {
      id: 'whatsapp-ulcer-3',
      message: `Great news! 🎉

Advanced ulcer diagnostics now available! 🔍

Features:
🖼️ High-resolution imaging
👍 Non-invasive
⚡ Quick results

Refer your patients today! 📱`
    }
  ]
};

/**
 * API Integration Guide:
 * 
 * To integrate with backend API:
 * 1. Replace TOPICS with API call to fetch topics
 * 2. Replace EMAIL_TEMPLATES with API call to fetch email templates
 * 3. Replace WHATSAPP_TEMPLATES with API call to fetch WhatsApp templates
 * 
 * Example API structure:
 * - GET /api/content/topics
 * - GET /api/content/templates/email/:topicId
 * - GET /api/content/templates/whatsapp/:topicId
 * - POST /api/content/send (to send messages)
 */