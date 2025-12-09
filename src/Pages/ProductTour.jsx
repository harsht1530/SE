import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Shepherd from "shepherd.js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../index.css";

const useProductTourSteps = (customNavigate, waitForElement) => {
  const initialProfileId = "MUL58399";
  const steps = [
    {
      id: 'step-newsfeed',
      title: "News Feed",
      text: "This is your News Feed where you can see the latest updates.",
      attachTo: { element: ".step-newsfeed", on: "bottom" },
      classes: "shepherd-theme-custom",
      modalOverlayOpeningPadding: "10",
      popperOptions: {
        modifiers: [{ name: "offset", options: { offset: [0, 48] } }],
      },
      beforeShow: async () => {
        customNavigate("newsFeed");
        await waitForElement(".step-newsfeed");
      },
      buttons: [
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: async function () {
            await customNavigate("newsFeed");
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-newsfeed-favourites',
      title: "NewsFeed Favourites",
      text: "Here you can see your favourites in the news feed.",
      attachTo: { element: ".step-newsfeed-favourites", on: "left" },
      beforeShow: async () => {
        customNavigate("newsFeed");
        await waitForElement(".step-newsfeed-favourites");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },

    {
      id: 'step-favourites',
      title: "Saved Favorites",
      text: "Your saved favorites live here. You can organize and manage them.",
      attachTo: { element: ".step-favourites", on: "bottom" },
      beforeShow: async () => {
        customNavigate("favourites");
        await waitForElement(".step-favourites");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: async function () {
            await customNavigate("newsFeed");
            await new Promise((resolve) => setTimeout(resolve, 100));
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: async function () {
            // Navigate to favourites before going to next step
            await customNavigate("favourites");
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-create-group',
      title: "Create Segment",
      text: "Here you can create your own favourites group to organize your content.",
      attachTo: { element: ".create-group", on: "right" },
      beforeShow: async () => {
        customNavigate("favourites");
        await waitForElement(".create-group"); // ✅ This is the key fix
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: async function () {
            // Navigate to favourites before going to next step
            await customNavigate("favourites");
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-crud-operations',
      title: "CRUD Operations",
      text: "Here you can Rename, Update, and Delete groups to manage your favorites.",
      attachTo: { element: ".crud-operations", on: "right" },
      beforeShow: async () => {
        customNavigate("favourites");
        await waitForElement(".crud-operations");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: async function () {
            // Navigate to favourites before going to next step
            await customNavigate("scientific-profiles");
            await new Promise((resolve) => setTimeout(resolve, 300));
            return this.next();
          },
        },
      ],
    },

    {
      id: 'step-scientific-profiles',
      title: "Scientific Profiles",
      text: "Search for scientific-related topics and research here.",
      attachTo: { element: ".scientific", on: "right" },
      beforeShow: async () => {
        customNavigate("scientific-profiles");
        await waitForElement(".scientific");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: async function () {
            await customNavigate("favourites");
            await new Promise((resolve) => setTimeout(resolve, 100));
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-digital-profiles',
      title: "Digital Profiles",
      text: "Search for digital-related topics and digital health information here.",
      attachTo: { element: ".digital", on: "right" },
      beforeShow: async () => {
        customNavigate("scientific-profiles");
        await waitForElement(".digital");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-clinical-profiles',
      title: "Clinical Profiles",
      text: "Search for clinical-related topics and clinical trials here.",
      attachTo: { element: ".clinical", on: "right" },
      beforeShow: async () => {
        customNavigate("scientific-profiles");
        await waitForElement(".clinical");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-location-search',
      title: "Location Search",
      text: "Search based on location to find relevant medical professionals and facilities.",
      attachTo: { element: ".location", on: "right" },
      beforeShow: async () => {
        customNavigate("scientific-profiles");
        await new Promise((resolve) => setTimeout(resolve, 600));
        await waitForElement(".location");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: async function () {
            const currentProfileId = window.location.pathname.includes(
              "/profile/"
            )
              ? window.location.pathname.split("/profile/")[1]
              : initialProfileId;
            await customNavigate(`profile/${currentProfileId}`);
            await new Promise((resolve) => setTimeout(resolve, 600));
            return this.next();
          },
        },
      ],
    },

    {
      id: 'step-profile-section',
      title: "Profile Section",
      text: "Doctor profile details are shown here with comprehensive information.",
      attachTo: { element: ".doctor-profile-section", on: "bottom" },
      beforeShow: async () => {
        const currentProfileId = window.location.pathname.includes("/profile/")
          ? window.location.pathname.split("/profile/")[1]
          : initialProfileId;
        await customNavigate(`profile/${currentProfileId}`);
        await new Promise((resolve) => setTimeout(resolve, 600));
        await waitForElement(".doctor-profile-section");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: async function () {
            // const currentProfileId = window.location.pathname.includes('/profile/')
            //   ? window.location.pathname.split('/profile/')[1]
            //   : initialProfileId;
            await customNavigate("scientific-profiles");
            await new Promise((resolve) => setTimeout(resolve, 500));
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "Next",
          classes: "btn btn-primary",
          action: async function () {
            const currentProfileId = window.location.pathname.includes(
              "/profile/"
            )
              ? window.location.pathname.split("/profile/")[1]
              : initialProfileId;
            await customNavigate(`profile/${currentProfileId}`);
            await new Promise((resolve) => setTimeout(resolve, 500));
            return this.next();
          },
        },
      ],
    },
    
    {
      id: 'step-ai-summary',
      title: "AI Summary",
      text: "View the AI-generated summary of the doctor with key insights and highlights.",
      attachTo: { element: ".Ai-summary", on: "bottom" },
      beforeShow: async () => {
        const currentProfileId = window.location.pathname.includes("/profile/")
          ? window.location.pathname.split("/profile/")[1]
          : initialProfileId;
        await customNavigate(`profile/${currentProfileId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await waitForElement(".Ai-summary");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-overview',
      title: "overview",
      text: "This is the overview section of the doctor profile, providing a summary of their qualifications and experience.",
      attachTo: { element: ".tour-overview-tab", on: "right" },
      beforeShow: async () => {
        const currentProfileId = window.location.pathname.includes("/profile/")
          ? window.location.pathname.split("/profile/")[1]
          : initialProfileId;
        await customNavigate(`profile/${currentProfileId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await waitForElement(".tour-overview-tab");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-scientific',
      title: "scientific",
      text: "This is the scientific section of the doctor profile, showcasing their research and publications.",
      attachTo: { element: ".tour-scientific-tab", on: "bottom" },
      beforeShow: async () => {
        const currentProfileId = window.location.pathname.includes("/profile/")
          ? window.location.pathname.split("/profile/")[1]
          : initialProfileId;
        await customNavigate(`profile/${currentProfileId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await waitForElement(".tour-scientific-tab");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-digital',
      title: "digital",
      text: "Explore the doctor's digital footprint including YouTube videos, shorts, and Twitter activity. Stay updated with their latest content and social media engagement.",
      attachTo: { element: ".tour-digital-tab", on: "bottom" },
      beforeShow: async () => {
        const currentProfileId = window.location.pathname.includes("/profile/")
          ? window.location.pathname.split("/profile/")[1]
          : initialProfileId;
        await customNavigate(`profile/${currentProfileId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await waitForElement(".tour-digital-tab");
      },
      buttons: [
        {
          text: "Back",
          classes: "btn btn-secondary",
          action: function () {
            return this.back();
          },
        },
        {
          text: "Skip Tour",
          classes: "btn btn-outline",
          action: function () {
            return this.complete();
          },
        },
        {
          text: "next",
          classes: "btn btn-primary",
          action: function () {
            return this.next();
          },
        },
      ],
    },
    {
      id: 'step-collaborators',
  title: "Collaborators",
  text: "Discover the doctor's professional network and research collaborations. View co-authors, affiliated institutions, and joint research projects. The collaborator cards show details like institution affiliations and publication counts.",
  attachTo: { element: ".tour-collaborator-tab", on: "bottom" },
  beforeShow: async () => {
    const currentProfileId = window.location.pathname.includes('/profile/') 
      ? window.location.pathname.split('/profile/')[1]
      : initialProfileId;
    await customNavigate(`profile/${currentProfileId}`);
    await waitForElement('.tour-collaborator-tab');
  },
  buttons: [
    {
      text: "Back",
      classes: "btn btn-secondary",
      action: function() {
        return this.back();
      }
    },
    {
      text: "Finish Tour",  
      classes: "btn btn-success",
      action: function() {
        return this.complete();
      }
    }
  ],
  classes: 'shepherd-theme-custom collaborator-tour-step',
  modalOverlayOpeningPadding: 8
}
  ];

  return steps;
};

const ProductTour = forwardRef((props, ref) => {
  const tourRef = useRef(null);

  const location = useLocation();
  const keyboardListenerRef = useRef(null);
  const navigate = useNavigate();

  const waitForElement = (selector, timeout = 7000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found`));
      }, timeout);
    });
  };

  // Helper function to handle next step navigation
  const handleNextStep = async () => {
    if (!tourRef.current?.isActive()) return;
    
    const currentStep = tourRef.current.currentStep;
    if (!currentStep) return;

    try {
      // Find the next button configuration from the current step
      const currentStepOptions = currentStep.options;
      const nextButtonConfig = currentStepOptions.buttons?.find(btn => 
        btn.classes?.includes('btn-primary') || btn.classes?.includes('btn-success')
      );
      
      if (nextButtonConfig && nextButtonConfig.action) {
        console.log('Executing next button action via keyboard');
        // Execute the button's action function with proper context
        const result = await nextButtonConfig.action.call(currentStep);
        return result;
      } else {
        // Fallback to regular next
        return tourRef.current.next();
      }
    } catch (error) {
      console.error('Error in keyboard next navigation:', error);
      return tourRef.current.next(); // Fallback
    }
  };

  // Helper function to handle previous step navigation
  const handlePreviousStep = async () => {
    if (!tourRef.current?.isActive()) return;
    
    const currentStep = tourRef.current.currentStep;
    if (!currentStep) return;

    try {
      // Find the back button configuration from the current step
      const currentStepOptions = currentStep.options;
      const backButtonConfig = currentStepOptions.buttons?.find(btn => 
        btn.classes?.includes('btn-secondary')
      );
      
      if (backButtonConfig && backButtonConfig.action) {
        console.log('Executing back button action via keyboard');
        // Execute the button's action function with proper context
        const result = await backButtonConfig.action.call(currentStep);
        return result;
      } else {
        // Fallback to regular back
        return tourRef.current.back();
      }
    } catch (error) {
      console.error('Error in keyboard back navigation:', error);
      return tourRef.current.back(); // Fallback
    }
  };

   // Enhanced keyboard navigation handler
  const handleKeyboardNavigation = async (event) => {
    if (!tourRef.current?.isActive()) return;

    const { key, ctrlKey, metaKey, altKey } = event;
    
    // Prevent default behavior for our navigation keys
    const navigationKeys = ['ArrowLeft', 'ArrowRight', 'Enter', 'Backspace', ' '];
    if (navigationKeys.includes(key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentStep = tourRef.current.currentStep;
    if (!currentStep) return;

    switch (key) {
      case 'ArrowRight':
      case 'Enter':
      case ' ': // Spacebar
        await handleNextStep();
        break;
        
      case 'ArrowLeft':
      case 'Backspace':
        await handlePreviousStep();
        break;
        
      case 'Escape':
        // Exit tour
        if (tourRef.current.isActive()) {
          tourRef.current.complete();
        }
        break;
        
      // Number keys for direct step navigation
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (ctrlKey || metaKey) {
          const stepIndex = parseInt(key) - 1;
          if (stepIndex < tourRef.current.steps.length) {
            tourRef.current.show(stepIndex);
          }
        }
        break;
        
      // Alt + S to skip tour
      case 's':
      case 'S':
        if (altKey) {
          tourRef.current.complete();
        }
        break;
    }
  };

  const addKeyboardListeners = () => {
    // Remove existing listener if any
    removeKeyboardListeners();
    
    keyboardListenerRef.current = handleKeyboardNavigation;
    document.addEventListener('keydown', keyboardListenerRef.current, { capture: true });
  };

  const removeKeyboardListeners = () => {
    if (keyboardListenerRef.current) {
      document.removeEventListener('keydown', keyboardListenerRef.current, { capture: true });
      keyboardListenerRef.current = null;
    }
  };

  const initializeTour = () => {
    // console.log('Initializing tour');

    tourRef.current = new Shepherd.Tour({
      useModalOverlay: true,
      keyboardNavigation: true,
      defaultStepOptions: {
        classes: "shepherd-theme-arrows custom-tour-theme",
        scrollTo: { behavior: "smooth", block: "center" },
        modalOverlayOpeningPadding: "10",
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
        },
        cancelIcon: {
          enabled: true,
          label: "close",
        },
        when: {
          show: async () => {
            const step = tourRef.current.currentStep;
            const { element } = step.options.attachTo;
            const targetElement = document.querySelector(element);
            if (targetElement) {
              targetElement.classList.add("shepherd-highlighted");
              targetElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
            // Add keyboard navigation when step shows
            addKeyboardListeners();
          },
        },
      },
    });

     // Tour event listeners
    tourRef.current.on('start', () => {
      console.log('Tour started - keyboard navigation enabled');
      addKeyboardListeners();
    });

    tourRef.current.on('complete', () => {
      console.log('Tour completed');
      removeKeyboardListeners();
    });

    tourRef.current.on('cancel', () => {
      console.log('Tour cancelled');
      removeKeyboardListeners();
    });

    // Create a custom navigate function that handles the path correctly
    const customNavigate = (path) => {
      return new Promise((resolve) => {
        navigate(path);
        // Wait for next tick to ensure navigation has started
        setTimeout(resolve, 100);
      });
    };

    const steps = useProductTourSteps(customNavigate, waitForElement);
    console.log("Available steps:", steps);

    let stepsAdded = 0;
    steps.forEach((step) => {
      tourRef.current.addStep(step);
      stepsAdded++;
    });

    // console.log(`${stepsAdded} steps added to tour`);
    return stepsAdded > 0;
  };

  useImperativeHandle(ref, () => ({
    startTour: () => {
      console.log("Start Tour triggered");
      if (!tourRef.current || tourRef.current.steps.length === 0) {
        // console.log('Reinitializing tour...');
        const initialized = initializeTour();
        if (!initialized) {
          console.warn("Failed to initialize tour");
          return;
        }
      }
      // console.log('Starting tour with steps:', tourRef.current.steps);
      tourRef.current.start();
    },

     // Additional methods for external control
    nextStep: () => {
      if (tourRef.current?.isActive()) {
        tourRef.current.next();
      }
    },
    
    previousStep: () => {
      if (tourRef.current?.isActive()) {
        tourRef.current.back();
      }
    },
    
    skipTour: () => {
      if (tourRef.current?.isActive()) {
        tourRef.current.complete();
      }
    }
  }));

  

  useEffect(() => {
    initializeTour();
    return () => {
      if (tourRef.current?.isActive()) {
        tourRef.current.complete();
      }
    };
  }, []);

  return null;
});

export default ProductTour;
