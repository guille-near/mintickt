<template>
  <Background>
    <template #content>
      <section id="newLanding--policy">
        <h1>Privacy Policy</h1>

        <p>
          Thank you for visiting www.mintickt.com (the “Platform”). Your privacy is important to us. This Privacy Policy (the “Policy”) describes the types of information Mintickt, 
          (the “Company”, “us”, “we”, or “our”) may collect from you or that you may provide when you visit the Platform or create, buy, transfer, or trade unique items in our Market 
          (the “Market”) (collectively with the Platform, the “Services”). This Policy also describes our policies and procedures for collecting, using, maintaining, protecting, and 
          disclosing that information.<br>
          This Policy applies to information we collect on the Platform and through your use of the Services generally (including when you register for an account), and through 
          communications between you and the Platform (including email, text, and other electronic messages). This Policy does not apply to information collected by third parties, 
          including any websites, services, and applications that you elect to access through the Services. It also does not apply to any information collected by the Company offline 
          or through any other means, including any other website operated by us or any third party (including our affiliates and subsidiaries). Please review this Policy carefully. 
          By accessing or using the Services (or by clicking on “accept” or “agree” to this Policy if prompted), you agree to the terms of this Policy on behalf of yourself or the 
          entity or organization that you represent. If you do not agree to any term in this Policy, you should refrain from further use of our Services. We may collect information 
          reasonably capable of identifying you as an individual (“Personal Information”). Personal Information does not include anonymous or aggregate information that does not 
          identify you as an individual.
        </p>
        
        <blockquote indent-plus margin-top>
          Creating a User or Event Organizer Account: If you sign up to use our Platform, we collect your NEAR (or other blockchain) wallet address, username, and email address. 
          The User may elect to provide their full name, location, biographical information, and a website.<br>
          Applying as an Artist: If you want to join the world’s top digital artists in our Market, we collect your first and last name, email address, a short application video, 
          NEAR (or other blockchain) wallet address, and information about your art.<br>
          Visiting the Site or Market: We also collect basic analytics data when you access or use the Platform through cookies. See below for more information about the cookies 
          we use and what data they may collect.
        </blockquote>

        <p margin>As further described below, we use the Personal Information we collect to:</p>

        <blockquote indent-plus margin-bottom>
          Make the Platform work and enable you to list, buy, transfer, or trade unique digital art;<br>
          Provide you with critical updates, confirmations, or security alerts;<br>
          Provide support or respond to your comments or questions;<br>
          Personalize and improve your experience;<br>
          Inform you about products, services, news, or promotional opportunities we think might interest you;<br>
          Analyze and improve our Platform.
        </blockquote>

        <template v-for="(item, i) in list">
          <h2 :key="i" v-html="`${i+1}. ${item.title}`" bold />
          <p v-if="item.text" :key="i" v-html="item.text" />

          <template v-if="item.subList">
            <template v-for="(item2, i2) in item.subList">
              <p :key="i2" v-html="`${i+1}.${i2+1}. ${item2.title}`" bold />
              <p v-if="item2.text" :key="i2" v-html="item2.text" />
            </template>
          </template>

          <template v-else-if="item.subListAlphabetical">
            <template v-for="(item2, i2) in item.subListAlphabetical">
              <p :key="i2" v-html="`${String.fromCharCode(i2+65)}. ${item2.title}`" bold />
              <p v-if="item2.text" :key="i2" v-html="item2.text" />
            </template>
          </template>

        </template>
      </section>

      <!-- footer -->
      <Footer></Footer>
    </template>
  </Background>
</template>

<script>
import Background from '@/components/NewLanding/Background.vue'
import Footer from '@/components/NewLanding/Footer.vue'

export default {
  name: "TermsAndConditions",
  components: {Background, Footer},
  data() {
    return {
      list: [
        {
          title: "Children Using or Accessing the Services.",
          text: "The Services and its content are not intended for, nor directed at, children under the age of thirteen (13). No one under the age of thirteen (13) may provide any Personal Information to or on the Services. Please note that we do not knowingly collect any personally identifiable information from children under the age of thirteen (13). If you are under the age of thirteen (13), please do not attempt to use or register for the Services or send any information about yourself to us, including your name, address, telephone number, or email address. If it is determined that we have inadvertently collected or received personally identifiable information from a child under the age of thirteen (13), we shall immediately take the necessary steps to ensure that such information is deleted from our system’s database. If you are a parent or legal guardian and think your child under the age of thirteen (13) has given us information, you can contact us at <a>support@mintickt.com</a>.",
        },
        {
          title: "Changes to Our Privacy Policy.",
          text: "This Policy was last revised on the date noted at the top of this page. We may update this Policy from time to time. If we make material changes, we will post the updated Policy on this page. Your continued use of the Services after we make changes is deemed to be acceptance of those changes, so please check the Policy periodically for updates.",
        },
        {
          title: "Information We Collect.",
          text: "We receive several types of information about you from various sources, including (A) information and content that you give us; (B) automatically-collected information; and © demographic information or other aggregate information; and (D) information from other sources. Each is described in further detail below.",
          subListAlphabetical: [
            {
              title: "Information and Content You Give Us.",
              text: "We collect Personal Information that you knowingly choose to disclose. This may include:<br> (i) Personal Information. Personal information, such as your name, address, e-mail address, username, password, and any other information you directly provide us on or through the Services. This includes information you provide when you register or create an account, or request customer service.<br> (ii) Email Correspondences. Records and copies of your email messages together with your email address and our responses, if you choose to correspond with us through email.<br> (iii) User Content. Information or content you submit to be published or displayed in public areas of the Services or transmitted to other users of the Services or third parties (collectively, “User Content”). Your User Content is posted on and transmitted to others at your own risk. The Company cannot control the actions of other users of the Services with whom you may choose to share your User Content. Therefore, we cannot and do not guarantee that your User Content will not be viewed by unauthorized persons.<br> (iv) Transaction Information. Information about any purchase or transactions made on the Services. This includes payment information, such as your credit or debit card number and other card information; other account and authentication information; and billing, shipping, and contact details.<br>",
            },
            {
              title: "Information We Collect Automatically.",
              text: "We may use a variety of technologies to collect certain information about your equipment, browsing actions, and patterns whenever you interact with the Services, including:<br> (i) Activity Information. Details of your visits to our Services, including the types of content you view or engage with; the features you use; the actions you take; the people or accounts you interact with; the time, frequency, and duration of your activities; and other information about your use of and actions on the Services.<br> (ii) Equipment Information. Information about your computer and internet connection, including your computer operating system, IP address, browser type, and browser language.<br> (iii) Location Information. Information about the location of your device, including GPS location, for purposes of enhancing or facilitating the Services. For example, such information may be used to enable the functionality or features of the Services that provide you with information about stores near you, or enable you to remotely order and pay for the Services. We may also use information about the location of the device you are using to help us understand how the Services and functionality are being used and to deliver more relevant advertising.<br> The gathering of this information may be used for maintaining the quality of the Services we provide, as well as providing overall general statistics related to the use of the Services. The technologies we use for this automatic data collection may include:<br> (i) Cookies. A cookie is a small data file stored on the hard drive of your computer either for only the duration of your visit on a website (“session cookies”) or for a fixed period (“persistent cookies”). Cookies contain information that can later be read by a web server. We may use cookies to provide you with a more personal and interactive experience on the Services.<br> (ii) Web Beacons. Web beacons are small files that are embedded in webpages, applications, and emails (also known as “clear gifs”, “pixel tags”, “web bugs”, and “single-pixel gifs”). Web beacons allow the Company, for example, to track who has visited those webpages or opened an email, to test the effectiveness of our marketing, and for other related website statistics.<br> (iii) JavaScripts. JavaScripts are code snippets embedded in various parts of websites and applications that facilitate a variety of operations including accelerating the refresh speed of certain functionality or monitoring usage of various online components.<br> (iv) Entity Tags. Entity Tags are HTTP code mechanisms that allow portions of websites to be stored or “cached” within your browser and validates these caches when the website is opened, accelerating website performance since the web server does not need to send a full response if the content has not changed.<br> (v) HTML5 Local Storage. HTML5 local storage allows data from websites to be stored or “cached” within your browser to store and retrieve data in HTML5 pages when the website is revisited.<br> (vi) Resettable Device Identifiers. Resettable device identifiers (also known as “advertising identifiers”) are similar to cookies and are found on many mobile devices and tablets (for example, the “Identifier for Advertisers” or “IDFA” on Apple iOS devices and the “Google Advertising ID” on Android devices), and certain streaming media devices. Like cookies, resettable device identifiers are used to make online advertising more relevant.<br> This Policy does not cover the use of tracking technologies by third parties. The Services may contain links, content, advertising, or references to other websites by third parties, including advertisers, ad networks and servers, content providers, and application providers. These third parties may use cookies or other tracking technologies to collect information about you when you use the Services. The information they collect may be associated with your Personal Information or they may collect information about your online activities over time and across different websites. Please be aware that we do not control these third parties’ tracking technologies or when and how they may be used. Therefore, the Company does not claim nor accept responsibility for any privacy policies, practices, or procedures of any third party. We encourage you to read the privacy statements and terms and conditions of linked or referenced websites you enter. If you have any questions about an ad or other targeted content, you should contact the responsible provider directly.",
            },
            {
              title: "Demographic Information.",
              text: "We may collect demographic, statistical, or other aggregate information that is about you, but individually does not identify you. Some of this information may be derived from personal information, but it is not Personal Information and cannot be tied back to you. Examples of such aggregate information include gender, age, race, household income, and political affiliation.",
            },
            {
              title: "Information from Other Sources.",
              text: "We may receive information about you from other sources and add it to our account information. We protect this information according to the practices described in this Policy, plus any additional restrictions imposed by the source of the data. These sources may include online and offline data providers, from which we obtain demographic, interest-based, and online advertising-related data; publicly-available sources such as open government databases or social networks; and service providers who provide us with information, or updates to that information, based on their relationship with you. By gathering additional information about you, we can correct inaccurate information, enhance the security of your transactions, and give you product or service recommendations and special offers that are more likely to interest you.",
            },
          ]
        },
        {
          title: "How We Use Your Information.",
          text: "We may use the information we collect about you in a variety of ways, including to:<br> (i) provide the Services and its content to you;<br> (ii) respond to comments and questions, and provide customer service;<br> (iii) fulfill any other purpose for which you provide such information;<br> (iv) communicate with you about your order, purchase, account, or subscription;<br> (v) inform you about important changes to, or other news about, the Services or any of its features or content;<br> (vi) operate, maintain, improve, personalize, and analyze the Services;<br> (vii) monitor and analyze trends, usage, and activities for marketing or advertising purposes;<br> (viii) detect, prevent, or investigate security breaches, fraud, and other unauthorized or illegal activity;<br> (ix) carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection;<br> (x) maintain appropriate records for internal administrative purposes;<br> (xi) allow you to participate in interactive features on the Services;<br> (xii) send promotional communications, such as information about features, newsletters, offers, promotions, contests, and events;<br> (xiii) share information across the Company’s products and devices to provide a more tailored and consistent experience on all Company products you use;<br> (xiv) develop, test, and improve new products or services, including by conducting surveys and research, and testing and troubleshooting new products and features;",
        },
        {
          title: "How We Share Your Information.",
          text: "We may disclose aggregated or anonymized information about our users without any restrictions. We will not share your Personal Information that we collect or you provide as described in this Policy except in the following circumstances:<br> (i) With subsidiaries and affiliates for business purposes. To our subsidiaries and affiliated companies for purposes of management and analysis, decision-making, and other business purposes.<br> (ii) When we work with service providers. To service providers, contractors, and other third parties that provide us with support services, such as credit card processing, website hosting, email and postal delivery, location mapping, product and service delivery, or analytics services, and who are bound by contractual obligations to keep Personal Information confidential and use it only for the purposes for which we disclose it to them.<br> (iii) When we become involved in a sale or transfer of the Company. If we become involved with a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of the Company’s assets (whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding), to business entities or people involved in the negotiation or transfer.<br> (iv) When we are required by law. To comply with any court order, law, or legal process, including responding to any government or regulatory request.<br> (v) When we enforce our rights. To enforce or apply this Policy, our Terms of Use (<a href='https://mintickt.com/terms' target='_blank'>https://mintickt.com/terms</a>), and other agreements, including for billing and collection purposes.<br> (vi) To help protect lawful interests. If we believe disclosure will help us protect the rights, property, or safety of the Company, our users, partners, agents, and others. This includes exchanging information with other companies and organizations for fraud protection, and spam and malware prevention.<br> (vii) To fulfill the purpose for that information or with your consent. To fulfill the purpose for which you provide the information, for any other purpose disclosed by us when you provide the information, or with your consent.<br> (viii) When we work with marketing service providers. To marketing service providers to assess, develop, and provide you with promotions and special offers that may interest you, administer contests, sweepstakes, and events, or for other promotional purposes.<br> Information that you post on or through the public areas of the Services (e.g., chat rooms, bulletin boards, and discussion groups) are generally accessible to and may be collected and used by, others and may result in unsolicited messages or other contact from others. Users of the Services are encouraged to exercise caution when providing Personal Information about themselves in public or interactive areas.",
        },
        {
          title: "Your Choices.",
          subList: [
            {
              title: "Mechanisms to Control Your Information.",
              text: "We strive to provide you with choices regarding the Personal Information you provide to us. We have created mechanisms to provide you with the following control over your information:<br> (i) Cookies & Other Tracking Technologies. You may be able to set your browser to reject cookies and certain other technologies by adjusting the appropriate settings in your browser. Each browser is different, but many common browsers have preferences that may be adjusted to allow you to either accept or reject cookies and certain other technologies before they are set or installed or allow you to remove or reject the use or installation of certain technologies altogether. We recommend that you refer to the Help menu in your browser to learn how to modify your browser settings. Please note that you cannot remove Flash cookies simply by changing your browser settings. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe’s website. If you disable or refuse cookies, please note that some parts of the Services may become inaccessible or may not function properly.<br> (ii) Promotional Communications from the Company. If you do not wish to have your contact information used by the Company to promote our own or third-party products or services, you can opt-out by (i) informing us of your preference at the time you sign up for voluntary communications we may offer (such as a newsletter), or complete any other form on or through the Services which we collect your data; (ii) if offered, modifying your user preferences in your account profile by checking or unchecking the relevant boxes; (iii) following the opt-out instructions in the promotional emails we may send you; or (iv) sending us an email stating your request. Please note that if you opt out of receiving promotional communications from us, we may still send you transactional communications, including emails about your account or purchases.<br> 6.2 How We Respond to Do Not Track Signals “Do Not Track” is a privacy preference you can set in most web browsers. When you turn on this preference, it sends a signal or message to the websites you visit indicating that you do not wish to be tracked. Please note that we currently do not respond to Do Not Track browser settings.",
            },
          ],
        },
        {
          title: "Accessing and Correcting Your Information.",
          text: "You may send us an email to request access to, correct, or remove any Personal Information that you have provided to us. You may also access, correct, or remove your Personal Information by logging into the Platform and visiting your account profile page. We cannot delete your Personal Information except by also deleting your account. We may not accommodate a request to change information if we believe the change would violate any law or legal requirement or cause the information to be incorrect. If you delete your User Content from the Services or your account, copies of your User Content may remain viewable in cached and archived pages, or might have been copied or stored by other users of the Services.",
        },
        {
          title: "California Privacy Rights.",
          text: "Under California Civil Code sections 1798.83-1798.84, California residents are entitled to ask us for a notice identifying the categories of personal customer information which we share with our affiliates and third parties for marketing purposes, and providing contact information for such affiliates and third parties. If you are a California resident and would like a copy of this notice, please submit a written request to the following address: <a>support@mintickt.com</a>.<br> We will make every effort to promptly respond to your request.",
        },
        {
          title: "How We Protect Your Information.",
          text: "We take reasonable precautions to secure your personal information. We have implemented technical, physical, and administrative security measures designed to reduce the risk of loss, misuse, unauthorized access, disclosure, or modification of your information. We have put in place appropriate physical, electronic, and managerial procedures to safeguard the information we collect. All information you provide to us is stored on our secure servers behind firewalls. When you transmit highly sensitive information (such as a credit card number) through the Services, we encrypt the transmission of that information using Secure Sockets Layer (SSL) technology.<br> The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of the Services, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.<br> While we have employed security technologies and procedures to assist safeguarding your personal information, no system or network can be guaranteed to be 100% secure. Unauthorized entry or use, hardware or software failure, and other factors may compromise the security of user information at any time. Any transmission of Personal Information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures contained on the Platform or any other Services.",
        },
        {
          title: "The Digital Millennium Copyright Act",
          text: "The Digital Millennium Copyright Act (DMCA) sets forth a notification and counter notification process initiated by a party complaining of alleged copyright infringement on the Platform. We may share information of the notifying, counter-notifying party, and any involved third parties, such as a collector, of an allegedly infringing artwork to facilitate communication between the relevant parties for the purposes of complying with or resolving a DMCA dispute or allegation of copyright infringement. Nothing in this Policy restricts our ability to: comply with applicable law, rules, or regulations, including the DMCA; comply with a civil, criminal, or regulatory inquiry, investigation, subpoena, or lawful court order; cooperate with law enforcement agencies about conduct we reasonably and in good faith believe may violate the law; protect our rights or our property; enforce our Terms of Service; or, prevent behavior that is (or that we think may be) illegal or unethical.",
        },
        {
          title: "Terms of Use.",
          text: `If you choose to visit the Services, your visit and any dispute over privacy is subject to this Policy and our Terms of Use (<a href='https://mintickt.com/terms' target='_blank'>https://mintickt.com/terms</a>), including limitations on damages, resolution of disputes, and application of the relevant laws.`,
        },
      ]
    }
  },
  methods: {
  }
};
</script>

<style src="../pages.scss" lang="scss"></style>
<style src="./Landing.scss" lang="scss"></style>
<style src="./NewLanding.scss" lang="scss"></style>
