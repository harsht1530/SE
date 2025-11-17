import React, { useEffect } from 'react';
import {useSelector} from 'react-redux'
const ChatwootWidget = () => {

    const user = useSelector(state => state.user)
  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_CHATWOOT_BASE_URL;
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'en',
      type: 'standard',
      welcomeTitle: 'Welcome to MULTIPLIER AI!',
      welcomeTagline: 'Need help exploring healthcare professionals or managing your favorites? We\'re here to assist you.',
      replyTime: 'Usually responds within an hour',
      preChatFormOptions: {
        requireEmailUpfront: true,
        preChatMessage: 'Please share your email to better assist you with your healthcare professional queries.'
      }
    };

    const script = document.createElement('script');
    script.src = BASE_URL + "/packs/js/sdk.js";
    script.defer = true;
    script.async = true;

    script.onload = function() {
      window.chatwootSDK.run({
        websiteToken: import.meta.env.VITE_CHATWOOT_SITE_TOKEN,
        baseUrl: BASE_URL
      });
    };

    if(user?.email){
        setTimeout(() => {
            window.$chatwoot.setUser(user.email,{
                email:user.email,
                role:user.role,
                companyId:user.companyId
            })
        },1000)
       
    }

    document.body.appendChild(script);

    return () => {
        if(window.$chatwoot){
            window.$chatwoot.reset();
        }
       
      document.body.removeChild(script);
    };
  }, [user?.email]);

  return null;
};

export default ChatwootWidget;