<template>
  <Background>
    <template #content>
      <section id="newLanding--terms">
        <h1>Terms and conditions</h1>

        <blockquote class="divcol" bold>
          PLEASE NOTE THAT YOUR USE OF AND ACCESS TO OUR SERVICES (DEFINED BELOW) ARE SUBJECT TO THE FOLLOWING TERMS; IF YOU DO NOT AGREE TO ALL OF THE FOLLOWING,
          YOU MAY NOT USE OR ACCESS THE SERVICES IN ANY MANNER.
          Effective Date: 06/21/2022

          <span style="margin-block: 15px 20px"><cite>Effective Date: 06/21/2022</cite></span>
        </blockquote>

        <p>
          Welcome to Mintickt. Please read on to learn the rules and restrictions that govern your use of our website(s), products, services, and applications (the “Services”). 
          If you have any questions, comments, or concerns regarding these terms or the Services, please contact us at support@mintickt.com. These Terms and Conditions (the “Terms”) 
          are a binding contract between you and Mintickt, Inc. (“Mintickt,” “we,” and “us”). You must agree to and accept all of the Terms, or you don’t have the right to use the 
          Services. Your using the Services in any way means that you agree to all of these Terms, and these Terms will remain in effect while you use the Services. 
          These Terms include the provisions in this document, as well as those in the posted Privacy Policy and Copyright Dispute Policy below.
        </p>

        <p margin-bottom>
          <b bold>NOTICE: Please read these Terms carefully.</b> They cover important information about Services provided to you and any charges, taxes, and 
          fees we bill you.
        </p>

        <p bold indent>
          These Terms include information about future changes to these Terms, limitations of liability, a class action waiver, and resolution of disputes by arbitration 
          instead of in court.
        </p>

        <p indent>
          Will these Terms ever change?**<br>
          We are constantly trying to improve our Services, so these Terms may need to change along with the Services. We reserve the right 
          to change the Terms at any time, but if we do, we will bring it to your attention by updating the Effective Date on the https://www.mintickt.com website, by sending 
          you an email, and/or by some other means.
        </p>

        <p margin-bottom>
          If you don’t agree with the new Terms, you are free to reject them; unfortunately, that means you will no longer be able to use the Services. If you use the Services 
          in any way after a change to the Terms is effective, that means you agree to all of the changes. Except for changes by us as described here, no other amendment or 
          modification of these Terms will be effective unless in writing and signed by both you and us.
        </p>

        <!-- list -->
        <template v-for="(item, i) in list">
          <h2 :key="i" indent v-html="`${i+1}. ${item.title}`" />
          <p v-if="item.text" :key="i" v-html="item.text" />

          <template v-if="item.subList">
            <template v-for="(item2, i2) in item.subList">
              <h3 :key="i2" indent v-html="`${`${i+1}.${i2+1}`} ${item2.title}`" />
              <p v-if="item2.text" :key="i2" v-html="item2.text" />

              <template v-if="item2.subList">
                <template v-for="(item3, i3) in item2.subList">
                  <p :key="i3" v-html="`${i+1}.${i2+1}.${i3+1} ${item3.title}`" />
                  <p :key="i3" v-html="item3.text" />
                </template>
              </template>
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
          title: "WHO ARE WE",
          subList: [
            {
              title: "Mintick.",
              text: "Mintickt is a blockchain-based platform whereby users can create events and engage in the purchase and sale of digital merchandise and other products, also known as a non-fungible token (NFT).",
            },
            {
              title: "The Services.",
              text: "Mintickt’s website <a href='www.mintickt.com' target='_blank'>www.mintickt.com</a> all of the webpages, subdomains, country-level domain variants, and subparts of those websites (collectively, our “Site”), all of the services available on or through the Site or otherwise provided by us (including our application programming interfaces), and all of our free mobile applications (collectively, the “Applications”) are offered, maintained and provided by Mintickt. We refer to all of these as our “Services.” For clarity, any access to or use of the Services via the Applications and the Applications themselves shall be deemed to be part of the Services and subject to these Terms of Service (as defined in Section 1.5).",
            },
            {
              title: "Users.",
              text: "Through the Services, Mintickt provides a marketplace for event organizers to create events and sell tickets as NFTs on the NEAR Blockchain. Once the event organizer is registered (“Owner”) with Mintickt, the Owner can organize, promote, market, manage, track, sell, distribute, and collect sales proceeds for NFTs. We refer to Owners and other visitors, browsers, and users of the Services collectively as “Users” or “you.” Those who purchase NFTs are referred to as “Buyers” or “you,” as the context determines.",
            },
            {
              title: "Contracting Party.",
              text: "The Services are being provided to you by, and you are entering into these Terms of Service with, Aries Music LLC, a US corporation, with its principal place of business at Aries Music LLC, 16192 Coastal Highway, Lewes Delaware, 19958 USA  (“Mintickt”). For purposes of these Terms of Service, Mintickt shall be referred to as “Mintickt,” “us,” “we” or “our.”",
            },
            {
              title: "Terms of Service.",
              text: "This agreement and the agreements incorporated herein by reference, including but not limited to the Privacy Policy, the Cookies Policy, and the Merchant Agreement, constitute our terms of service agreement (“Terms of Service”). These Terms of Service govern all of our Services, which are offered subject to your acceptance without modification of these Terms of Service. SECTION 13 OF THESE TERMS OF SERVICE INCLUDES: (A) AN ARBITRATION PROVISION FOR USERS LOCATED IN THE UNITED STATES; (B) A WAIVER OF RIGHTS TO BRING A CLASS ACTION AGAINST MINTICKT FOR USERS LOCATED IN THE UNITED STATES; (c) CERTAIN DISCLAIMERS OF WARRANTIES ON BEHALF OF MINTICKT; (D) CERTAIN LIMITATIONS OF LIABILITY FOR THE BENEFIT OF MINTICKT; AND (E) A RELEASE BY YOU OF ALL CLAIMS FOR DAMAGE AGAINST MINTICKTARISING OUT OF DISPUTES BETWEEN YOU AND THIRD PARTIES IN CONNECTION WITH YOUR USE OF THE SERVICES. BY USING ANY OF THE SERVICES, YOU AGREE TO THESE PROVISIONS.",
            },
          ],
        },

        {
          title: "YOUR ACCEPTANCE.",
          subList: [
            {
              title: "Binding Agreement.",
              text: "You agree to these Terms of Service and you enter into a binding contract with Mintickt: (a) when you log in with your NEAR wallet, (b) sign up for a registered account by clicking “Sign Up,” “Register Now,” “Get Started” or similar buttons; (c) when an Owner posts an NFT on the Mintickt platform; or (d) by downloading Applications or using, accessing or browsing any part of the Services. If you do not agree to any portion of these Terms of Service, do not use or access the Services. If you will be using the Services on behalf of an entity, you agree to these Terms of Service on behalf of that entity and its affiliates and you represent that you have the authority to do so. In such cases, “you” and “your” will refer to that entity. If you do not have such authority, or if you do not agree to any portion of these Terms of Service, do not use or access the Services.",
            },
            {
              title: "Modifications.",
              text: "Except to the extent set forth in Section 13.11 below and as stated above, Mintickt reserves the right, at its sole discretion, to modify or replace any of the terms or conditions of these Terms of Service (or any of the agreements that make up these Terms of Service) at any time.",
            },
            {
              title: "Language.",
              text: "We may translate these Terms of Service (or any of the agreements that make up or are incorporated within, these Terms of Service) into other languages for your convenience. The English language version of each of these documents is the version that governs your use of the Services and in the event of any conflict between the English language version and a translated version, the English language version will control.",
            },
          ]
        },

        {
          title: "YOUR USE OF THE SERVICES.",
          subList: [
            {
              title: "The Services.",
              subList: [
                {
                  title: "Mintickt hereby grants you a personal, non-exclusive, non-transferable, non-sublicensable (except to sub-Users registered via the Services), revocable, limited right to access and use the Services solely for the purposes of (a) browsing the Services and searching for, viewing, registering for or purchasing NFTs; and/or (b) if you are an Owner, creating an Owner profile and other webpages with respect to, and promoting, marketing, managing, selling, distributing and collecting sales proceeds for NFTs, in each case (i) in compliance with these Terms of Service; and (ii) to the extent permitted under all applicable local, state, provincial, national and other laws, rules and regulations. 3.1.2 Notwithstanding the foregoing, you shall not, and shall not permit anyone else to, directly or indirectly (a) copy, modify, reproduce, translate, localize, port or otherwise create derivatives of any part of the Services; (b) reverse engineer, disassemble, decompile or otherwise attempt to discover the source code or structure, sequence and organization of all or any part of the Services (except that this restriction shall not apply to the limited extent restrictions on reverse engineering are prohibited by applicable local, state, provincial, national or other law, rule or regulation); (c) rent, lease, resell, distribute, use the Services for timesharing, service bureau or other commercial purposes not contemplated by this paragraph or otherwise exploit the Services in any unauthorized or unintended manner; (d) remove or alter any proprietary notices or labels on or in the Services; or (e) engage in any activity that interferes with or disrupts the Services. Any rights not expressly granted in this paragraph are reserved.",
                }
              ]
            },
            {
              title: "The Applications.",
              text: "You may access and use the Services through our Applications. For clarity, any access to or use of the Services via the Applications and the Applications themselves shall be deemed to be part of the Services and subject to these Terms of Service. This right to access and use the Applications may be revoked in accordance with Section 11 and Mintickt may discontinue or modify the Applications as set forth in Section 3.4 below.",
            },
            {
              title: "Additional Services.",
              text: "Mintickt may, upon request, and for such fees as Mintickt may establish from time to time in its sole discretion, provide additional services to you beyond the basic functionality of the Site and Applications, including without limitation, marketing and promotion services, and dedicated account management services. All such additional services, whether provided prior to, during or following the purchase or sale of NFTs, shall be deemed a part of the Services and subject to all the terms and conditions of these Terms of Service. Such additional services shall be set forth in additional terms and conditions or other written agreements between you and an authorized officer of Mintickt and shall set forth the applicable fees and the other terms and conditions relating to such additional services. The standard fees for the Services shall be 10% of gross revenue for primary sales and 2.5% of net revenue for secondary sales. “Gross Revenue” means the sum of all monies or other consideration received by Mintickt or other third parties on behalf of Mintickt (e.g., including any amounts to be retained by or paid to billing partners), in each case, in connection with the sales of NFTs. “Net Revenue” means Gross Revenue less only local sales tax or value-added tax (if any) that are required by applicable laws to be collected from buyers of NFTs and paid to competent taxing authorities in respect of the same.",
            },
            {
              title: "Service Modification.",
              text: "We are constantly evolving our products and services to better meet the needs of our entire user base. Because of this, we do not guarantee any set of product features or functionality and reserve the right at any time, and from time to time, to modify, suspend or discontinue, temporarily or permanently, any part of the Services for any reason. Because you only pay fees to Mintickt as you use the Services, there would be no refund of fees already due following any such change to the Services.",
            },
          ]
        },

        {
          title: "ACCOUNT, PASSWORD, AND SECURITY.",
          subList: [
            {
              title: "Registration.",
              text: "As part of certain registration processes on the Services, you may be required to sign up for an account and select a password and user name (“Mintickt User ID”). You agree (a) to provide true, accurate, current, and complete information about yourself, or if you are using the Services on behalf of an entity, the entity, as prompted by each Service registration form (the “Registration Data”); and (b) to maintain and promptly update the Registration Data to keep it true, accurate, current and complete. You promise to provide us with accurate, complete, and updated registration information about yourself. You may not select as your Mintickt User ID a name that you don’t have the right to use, or another person’s name with the intent to impersonate that person. If you’re agreeing to these Terms on behalf of an organization or entity, you represent and warrant that you are authorized to agree to these Terms on that organization or entity’s behalf and bind them to these Terms (in which case, the references to “you” and “your” in these Terms, except for in this sentence, refer to that organization or entity). You may not transfer your account to anyone else without our prior written permission. In the event of any dispute between two or more parties, as to account ownership, you agree that Mintickt shall be the sole arbiter of such dispute in its discretion and that Mintickt’s decision (which may include termination or suspension of any account subject to dispute) shall be final and binding on all parties. Mintickt may, in our sole discretion, refuse to open an account, or limit the number of accounts that you may hold or suspend or terminate any account or the trading of specific digital currency in your account. You agree that Mintickt is permitted to share Registration Data. You authorize us to make inquiries, whether directly or through third parties, that we consider necessary to verify your identity or protect you and/or us against fraud or other financial crime, and to take action we reasonably deem necessary based on the results of such inquiries. When we carry out these inquiries, you acknowledge and agree that your personal information may be disclosed to credit reference and fraud prevention or financial crime agencies and that these agencies may respond to our inquiries in full. This is an identity check only and should have no adverse effect on your credit rating, although we cannot and will not guarantee it.",
            },
            {
              title: "Security.",
              text: "You are responsible for maintaining the confidentiality of your password and account details and are fully responsible for all activities that occur under your account, including without limitation, all actions by sub-users registered under your account. You agree to immediately notify Mintickt of any unauthorized use of your password or account or any other breach of security.",
            },
            {
              title: "Age Restrictions.",
              text: "Mintickt is concerned about the safety and privacy of children. For this reason, and to be consistent with the terms of use of any third-party service providers used by Mintickt, you must be at least eighteen (18) years of age, or the legal age of majority where you reside, to use the Services. You represent and warrant that you are of legal age to form a binding contract (or if not, you’ve received your parent’s or guardian’s permission to use the Services and gotten your parent or guardian to agree to these Terms on your behalf). Otherwise, you may use the Services only with the involvement of a parent or guardian. In any event, you may not use the Services if you are under the age of thirteen (13). The Children’s Online Privacy Protection Act (“COPPA”) requires that online service providers obtain parental consent before they knowingly collect personally identifiable information online from children who are under 13. We do not knowingly collect or solicit personally identifiable information from a child under 16 without obtaining verifiable consent from that child’s parent or guardian (“Parental Consent”), except for the limited amount of personally identifiable information we need to collect in order to obtain Parental Consent (“Required Information”). Until we have received Parental Consent, we will only use Required Information for the purpose of obtaining Parental Consent. If you are a child under 16, please do not attempt to send any personal information about yourself to us before we obtain Parental Consent, except for the Required Information in the context of the Parental Consent process. If you believe that a child under 16 has provided us with personal information (beyond the Required Information) without our obtaining Parental Consent, please contact us at <a>support@mintickt.com</a>.",
            },
          ]
        },

        
        {
          title: "CONTENT.",
          subList: [
            {
              title: "Site Content.",
              text: "You agree that all material, including without limitation information, data, text, editorial content, design elements, look and feel, formatting, graphics, images, photographs, videos, music, sounds, and other content (collectively, “Content”), contained in or delivered via the Services or otherwise made available by Mintickt in connection with the Services (collectively, “Site Content”) is protected by copyrights, trademarks, service marks, trade secrets or other intellectual property and other proprietary rights and laws. Mintickt may own the Site Content or portions of the Site Content may be made available to Mintickt through arrangements with third parties. The compilation of all Site Content included in or made available through the Services is the exclusive property of Mintickt and is protected by copyright laws. You promise to abide by all copyright notices, trademark rules, information, and restrictions contained in any Content you access through the Services. Except as expressly authorized by Mintickt in writing or in connection with your permitted use of the intended functionality of the Services, you agree not to sell, license, rent, modify, distribute, copy, reproduce, transmit, publicly display, publicly perform, publish, adapt, edit or create derivative works of any Site Content, or post any Site Content on any other website or in a networked computer environment for any purpose. You shall use the Site Content only for purposes that are permitted by these Terms of Service and any applicable local, state, provincial, national or other law, rule or regulation. Any rights not expressly granted herein are reserved. Any information or content publicly posted or privately transmitted through the Services is the sole responsibility of the person from whom such content originated, and you access all such information and content at your own risk, and we aren’t liable for any errors or omissions in that information or content or for any damages or loss you might suffer in connection with it. We cannot control and have no duty to take any action regarding how you may interpret and use the Content or what actions you may take as a result of having been exposed to the Content, and you hereby release us from all liability for you having acquired or not acquired Content through the Services. We can’t guarantee the identity of any users with whom you interact in using the Services and we are not responsible for which users gain access to the Services.",
            },
            {
              title: "Your Content.",
              text: "Mintickt does not make any claim to Your Content. However, you are solely responsible for your Content. You hereby grant Mintickt a non-exclusive, worldwide, perpetual, irrevocable, royalty-free, transferable, sublicensable (through multiple tiers) right and license to access, use, reproduce, transmit, adapt, modify, perform, display, distribute, translate, publish and create derivative works based on Your Content, in whole or in part, in any media, for the purpose of operating or promoting the Services and you hereby waive any and all moral right to use the name you submit with Your Content. Notwithstanding the foregoing, Mintickt does not claim, and you do not transfer, any ownership rights in any of Your Content and nothing in these Terms of Service will restrict any rights that you may have to use and exploit Your Content outside of the Services. You represent and warrant that you have all the rights, power and authority necessary to grant the foregoing license, and that all your use of the Services or Your Content (a) does not infringe or violate the intellectual property rights or any other rights of anyone else (including Mintickt); (b) violates any law or regulation, including, without limitation, any applicable export control laws; (c) is harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable; (d) jeopardizes the security of your Mintickt account or anyone else’s (such as allowing someone else to log in to the Services as you); (e) attempts, in any manner, to obtain the password, account, or other security information from any other user; (f) violates the security of any computer network, or cracks any passwords or security encryption codes; (g) runs Maillist, Listserv, any form of auto-responder or “spam” on the Services, or any processes that run or are activated while you are not logged into the Services, or that otherwise interfere with the proper working of the Services (including by placing an unreasonable load on the infrastructure of the Services); (h) “crawls,” “scrapes,” or “spiders” any page, data, or portion of or relating to the Services or Content (through use of manual or automated means); (i) copies or stores any significant portion of the Content; (j) decompiles, reverse engineers, or otherwise attempts to obtain the source code or underlying ideas or information of or relating to the Services; and (k) does not violate these Terms of Service, including without limitation the Privacy Policy. In addition, Your Content must be accurate and truthful. Mintickt reserves the right to remove any of Your Content from the Services at any time if Mintickt believes in its discretion that Your Content violates these Terms of Service. In addition, you agree that Mintickt may use your name and logo (whether or not you have made it available through the Services) for the purpose of identifying you as an existing or past customer of Mintickt on the Services.",
            },
            {
              title: "Feedback and Revisions.",
              text: "You hereby acknowledge that (a) any and all suggestions for correction, change, and modification to the Services and other feedback (including but not limited to quotations of written or oral feedback), information, and reports provided to Mintickt by you (collectively “Feedback”); and (b) all improvements, updates, modifications or enhancements, whether made, created or developed by Mintickt or otherwise relating to Feedback (collectively, “Revisions”), are and will remain the property of Mintickt. All Feedback and Revisions become the sole and exclusive property of Mintickt and Mintickt may use and disclose Feedback and/or Revisions in any manner and for any purpose whatsoever without further notice or compensation to you and without retention by you of any proprietary or other right or claim. You hereby assign to Mintickt any and all rights, titles, and interests (including, but not limited to, any patent, copyright, future copyright, trade secret, trademark, show-how, know-how, and any and all other intellectual property right) that you may have in and to any and all Feedback and Revisions. You hereby agree to waive any moral rights you may have in any and all Feedback and Revisions, and consent to any act which amounts to an infringement of any such moral right, in favor of Mintickt. At Mintickt’s request, you will execute any document, registration, or filing required to give effect to these provisions.",
            },

            {
              title: "Removing and Re-Posting of Content.",
              subList: [
                {
                  title: "Getting Allegedly Infringing Content Removed.",
                  text: "If you believe in good faith that any Content made available in connection with the Services infringes your copyright or trademark rights, you (or your agent) may send us a takedown notice requesting that the Content be removed, or access to it be blocked. Such takedown notices need to contain the following information in order for Mintickt to be able to take action: a) Information reasonably sufficient to permit Mintickt to contact you (i.e., name and address, telephone number and/or email address); b) Sufficient information to identify the copyrighted works or trademarks that are allegedly being infringed, including registration number and registration office if applicable; c) Sufficient information to identify the allegedly infringing material that is to be removed and its Internet location (i.e., URL address); d) A statement that you have a good faith belief that the use of the material is not authorized by the owner, its agent or the law; e) A statement of the accuracy of the takedown notice, and under penalty of perjury, a statement that you are the owner of the allegedly infringed material or you are authorized to act on behalf of such owner; and f) A physical or electronic signature of the person submitting the takedown notice. The simplest and most efficient way to submit a written takedown notice is by reporting the infringement to our Trust and Safety Team, which is our DMCA/Trademark Agent, at team@mintickt.com. Filing this notice is the fastest method for reporting alleged copyright and/or trademark infringement. The foregoing information is required in your takedown notice request.",
                },
                {
                  title: "Liability.",
                  text: "Please note that by submitting a takedown notice, you agree that Mintickt may provide copies of such takedown notice to the alleged infringer and that the information in such takedown notice is subject to Mintickt’s Privacy Policy. In addition, you will be liable for any damages (including costs and attorneys’ fees) incurred by Mintickt or the alleged infringer in the event you knowingly and materially misrepresent that any Content is infringing taking into consideration copyright defenses (such as fair use) and exceptions. If you are unsure whether the material you are reporting is infringing, you should contact an attorney before filing a takedown notice. Mintickt cannot provide you with legal advice as to whether you are entitled to file a takedown notice.",
                },
                {
                  title: "Takedown.",
                  text: "Upon receiving a valid and fully completed takedown notice, Mintickt will expeditiously remove or disable access to the allegedly infringing material and notify the alleged infringing party.",
                },
                {
                  title: "Getting Content Reposted That Is Not Infringing.",
                  text: "Note that if a portion of Your Content has been removed by Mintickt from the Services, the fastest way to get such portion reposted is to remove such portion that is allegedly infringing as specified in the takedown notice. However, if you cannot or will not remove the allegedly infringing portion of Your Content and you have a good faith belief that such portion was removed, or access was disabled, by mistake or misidentification, you may send a written counter-notice to Mintickt. Such counter notices need to contain the following information in order for Mintickt to be able to take action: a) Information reasonably sufficient to permit Mintickt to contact you (i.e., name and address, telephone number and/or email address); b) Sufficient information to identify the portion of Your Content that has been removed or to which access has been disabled and its location before removal (i.e., URL address); c) A statement under penalty of perjury that you have the good faith belief that the portion of Your Content was removed or access to the material was disabled by mistake or misidentification; d) A statement that you are the account holder of the account to which the takedown notice relates or an authorized representative of such account holder; e) A statement that you consent to jurisdiction of the federal district court in which Mintickt is located, or if you reside outside the United States, for any judicial district in which Mintickt may be found, and that you will accept service of process from the person who provided notification of infringement or an agent of such person; and f) A physical or electronic signature of you or your authorized representative (i.e., an agent). The simplest and most efficient way to submit a written counter-notice is reporting the notice to our Trust and Safety Team, which is our DMCA/Trademark Agent, at team@mintickt.com. Filing this form is the fastest method to have your dispute reviewed. As a member of the Mintickt community, we ask that you only submit counter-notices for materials that you believe (in good faith) that you are entitled to use. Please note that by submitting a counter notice, you agree that Mintickt may provide copies of the counter-notice to the complaining party and that the information in such counter-notice is subject to Mintickt’s Privacy Policy. Please also note that there may be statutory periods that Mintickt must wait and certain inactions on the part of the complaining party for Mintickt to be able to repost the allegedly infringing material.",
                },
                {
                  title: "Notice Address.",
                  text: "If you do not wish to fill out and submit the electronic forms above, takedown notices and counter-notices must be submitted in writing to the address below:<br><br> 16192 Coastal<br> HighwayLewes, Delaware<br> 19958 USA",
                },
              ]
            },
          ]
        },

        {
          title: "LINKS.",
          subList: [
            {
              title: "Third-Party Websites.",
              text: "The Services may provide, or Users may provide, links to other Internet websites or resources. Because Mintickt has no control over such websites and resources, you acknowledge and agree that Mintickt is not responsible for the availability of such websites or resources, and does not endorse and is not responsible or liable for any Content, advertising, products, services or other materials on or available from such websites or resources, or any damages or losses related thereto, even if such websites or resources are connected with Mintickt partners or third-party service providers.",
            },
            {
              title: "Linked Accounts.",
              text: "As part of the Services, you may be able to link an account you have with a third-party service, such as a social media website. By linking such third-party account, you agree that Mintickt may access, make available to and store any Content that you have provided to and stored in such third-party account so that it is available on or through the Services. Such content may include personally identifiable information.",
            },
          ]
        },

        {
          title: "CONDUCT.",
          subList: [
            {
              title: "Certain Restrictions.",
              text: "You understand that you are liable for all Content, in whatever form, that you provide or otherwise make available to or through the Services, including to other users of the Services. You agree (i) to use the Services in accordance with our Community Guidelines; and (ii) not to use the Services to: a) upload, post, email, transmit or otherwise make available any Content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another’s privacy, hateful, or racially, ethnically or otherwise objectionable; b) harm minors in any way; c) facilitate gambling, gaming, lotteries, raffles, contests, sweepstakes and/or any other activity featuring the award of a prize; d) impersonate any person or entity, including, but not limited to, a Mintickt representative, or falsely state or otherwise misrepresent your affiliation with a person or entity; e) forge headers or otherwise manipulate identifiers in order to disguise the origin of any Content transmitted through the Services; f) upload, post, email, transmit or otherwise make available any Content that you do not have a right to make available under any law or under contractual or fiduciary relationships (such as inside information, proprietary and confidential information learned or disclosed as part of employment relationships or under nondisclosure agreements); g) upload, post, email, transmit or otherwise make available any Content that infringes any patent, trademark, trade secret, copyright, right of publicity or personality, or other intellectual property or proprietary rights of any person or entity; h) upload, post, email, transmit or otherwise make available any Content related to the sale or provision of goods and services other than the sale of NFTs; i) upload, post, email, transmit or otherwise make available any Content that contains viruses or any other computer code, files or programs that interrupt, destroy or limit the functionality of or to otherwise interact with the Services in a manner not permitted by these Terms of Service; j) interfere with or disrupt the Services or servers or networks connected to the Services, or disobey any requirements, procedures, policies or regulations of networks connected to the Services; k) attempt to probe, scan or test the vulnerability of any Mintickt server or network or breach any security or authentication measures, unless you are an authorized contractor of Mintickt specifically engaged to provide such services; l) attempt to avoid or circumvent any technological measure implemented by Mintickt to protect the Services or Content on the Services, including without limitation, encryption technology used to protect sensitive personal information; m) solicit any User to use a third-party service that competes with Mintickt; n) advertise your NFT but complete sales independent of the Services in order to circumvent the obligation to pay fees related to the Services; o) intentionally or unintentionally violate any applicable local, state, provincial, national or other law, rule or regulation, including without limitation laws and regulations regarding the sale of tickets; p) sell NFTs to which you have no rights; q) collect credit card number, expiration date or CSC code or any other credit card information other than in the fields under “Payment” on the order payment page; r) collect social security or insurance number, financial account number, driver license number, health information or other sensitive information required to be secured under applicable local, state, provincial, national or other law, rule or regulation or for which disclosure is required in case of a data breach without first obtaining Mintickt’s prior written consent; or s) stalk or otherwise harass any person or entity.",
            },
            {
              title: "Certain Remedial Rights.",
              text: "You acknowledge that Mintickt does not pre-screen Your Content or the Content of any other User in connection with the Services, but that Mintickt and its designees shall have the right (but not the obligation) to monitor, alter, edit, or remove any of Your Content, in whole or in part, based on violations of these Terms of Service. If we believe that Your Content could be changed so as to not violate these Terms of Service, we will attempt to send you notice prior to taking any such action, provided, that if we must act immediately to comply with applicable local, state, provincial, national or other law, rule or regulation or to limit our liability, we may take such action without prior notice. You acknowledge and agree that Mintickt may preserve Your Content and account information and may also disclose Your Content and account information if required to do so by law or in the good faith belief that such preservation or disclosure is reasonably necessary to (a) comply with legal process; (b) respond to claims that any of Your Content violates the rights of third parties; (c) enforce or administer these Terms of Service; and/or (d) protect the rights, property and/or personal safety of Mintickt, its users and/or the public, including fraud prevention. You understand that the technical processing and transmission of the Services, including Your Content, may involve transmissions over various networks and/or changes to conform and adapt to technical requirements of connecting networks or devices.",
            },
          ]
        },

        
        {
          title: "SUB-DOMAINS.",
          text: "Mintickt may provide you with the right to use a sub-domain within the Site (e.g., [sub-domain prefix].mintickt.com) for a specified purpose. All such sub-domains are the sole property of Mintickt and we reserve the right to determine the appearance, design, functionality and all other aspects of such sub-domains. In the event, Mintickt provides you with a sub-domain, your right to use such sub-domain will continue only for so long as your NFT is actively selling on the Services and you are in compliance with these Terms of Service. If Mintickt terminates your right to use a sub-domain for any other reason, it will provide you with a new sub-domain.",
        },

        {
          title: "MINTICKTS’S ROLE.",
          subList: [
            {
              title: "Listing Service and Limited Agent.",
              text: "Mintickt is not the Owner or owner of any NFT, product or service (other than the Services) listed for sale or registration on the Services. All sales are made by the Owner listed on the applicable event page. If an Owner has elected to use Mintickt’s payment processing service, Mintickt also acts as the Owner’s limited agent, using third-party payment providers through the Services, to collect payments from Buyers and transferring such payments to the applicable Owner. The Owner is solely responsible for ensuring that any NFT posting on the Services and the nature thereof meet all applicable local, state, provincial, national, and other laws, rules, and regulations and that the goods and services described in any posting are actually delivered in a satisfactory manner.",
            },
            {
              title: "Selection of Payment Processing Method.",
              text: "As an Owner, you may select your preferred payment processing method for your NFT, provided, that once you sell the NFT you may not change the payment processing method for that NFT. As a Buyer, you will be using whatever payment processing method the Owner of the applicable event has selected. If the Owner has selected a payment processing method that uses a third party to process the payment, then neither Mintickt nor any of its third-party payment processing partners processes the transaction but may transmit Buyer’s payment details to the Owner’s designated payment provider. If the Owner has elected to use Mintickt’s payment processing service, Mintickt will use third-party payment processing partners to process the transaction as Owner’s limited payment agent.",
            },
          ]
        },

        {
          title: "FEES.",
          subList: [
            {
              title: "",
              text: "Creating an account, listing NFTs, and accessing the Services is free. We charge our fees only when you sell or buy NFTs, products, or services. All descriptions of standard fees on the Services represent the standard fees that Mintickt charges to Owners. These fees may vary based on individual agreements between Mintickt and certain Owners. Mintickt does not control (and thus cannot disclose) fees levied by your bank and/or credit card company, including fees for purchasing NFTs in foreign currencies or from foreign persons. Be sure to check with your bank or credit card company prior to engaging in a transaction to understand all applicable fees, credit card surcharges, and currency conversion rates.",
            },
            {
              title: "Mintickt Refund Policy.",
              text: "Fees paid to Mintickt are nonrefundable.",
            },
          ]
        },

        {
          title: "TERM; TERMINATION.",
          subList: [
            {
              title: "Term.",
              text: "These Terms of Service are effective as set forth under Section 2.1 above and continue in effect until terminated.",
            },
            {
              title: "Termination by Mintickt.",
              text: "Except to the extent we have agreed otherwise in a separate written agreement between you and an authorized officer of Mintickt, Mintickt may terminate your right to use the Services at any time (a) for your violation or breach of these Terms of Service; (b) for your misuse or abuse of the Services; or (c) if allowing you to access and use the Services would violate any applicable local, state, provincial, national and other laws, rules and regulations or would expose Mintickt to legal liability. We will use reasonable efforts to provide you notice of any such termination. Further, you agree that Mintickt shall not be liable to you or any third party for any such termination of your right to use or otherwise access the Services.",
            },
            {
              title: "Termination by You.",
              text: "Except to the extent you have agreed otherwise in a separate written agreement between you and an authorized officer of Mintickt, you may terminate your access to the Services and these Terms of Service at any time. At such time, you must delete your Mintickt account. In the event, there is a separate agreement between you and Mintickt governing your use of the Services, and that agreement terminates or expires, these Terms of Service (as unmodified by such agreement) shall govern your use of the Services unless and until you delete your account.",
            },
            {
              title: "Survival of Terms.",
              text: "All provisions of these Terms of Service that by their nature should survive termination of these Terms of Service shall survive (including, without limitation, all limitations on liability, releases, indemnification obligations, disclaimers of warranties, agreements to arbitrate, choices of law and judicial forum and intellectual property protections and licenses).",
            },
            {
              title: "Changes to Services.",
              text: "We’re always trying to improve the Services, so they may change over time. We may suspend or discontinue any part of the Services, or we may introduce new features or impose limits on certain features or restrict access to parts or all of the Services. We reserve the right to remove any Content from the Services at any time, for any reason (including, but not limited to, if someone alleges you contributed that Content in violation of these Terms), in our sole discretion, and without notice.",
            },
          ]
        },

        {
          title: "SPECIAL TERMS FOR INTERNATIONAL USE.",
          text: "The Services are subject to United States export controls and economic sanctions laws. In accepting these Terms of Service you represent and warrant that: (a) you are not located in, and you are not a national or resident of, any country to which the United States, United Kingdom, European Union, Australia or Canada has embargoed goods and/or services of the same type as the Services (“Restricted Countries”), including without limitation, Cuba, Iran, North Korea, Sudan or Syria; and (b) you are not a person or entity, or owned by, under the control of, or affiliated with, a person or entity (i) that appears on the U.S. Office of Foreign Assets Control’s Specially Designated Nationals List, Foreign Sanctions Evaders List or Palestinian Legislative Council List; (ii) that appears on the U.S. Department of State’s Terrorist Exclusion List; (iii) that appears on the Bureau of Industry and Security’s Denied Persons, Entity or Unverified List; (iv) that appears on the Consolidated List of Targets published by the U.K. HM Treasury; (v) that appears on the Consolidated List published by the A.U. Department of Foreign Affairs and Trade; (vi) that is subject to sanctions in any other country; or (vii) that is engaged in the design, development or production of nuclear, biological or chemical weapons, missiles or unmanned aerial vehicles.",
        },

        {
          title: "IMPORTANT LEGAL TERMS GOVERNING ALL USE OF THE SERVICES.",
          subList: [
            {
              title: "Indemnification.",
              text: "You agree to defend, indemnify and hold Mintickt, and its affiliates and subsidiaries, and each of its and their respective officers, directors, agents, co-branders, licensors, payment processing partners, other partners and employees, harmless from any and all damage (whether direct, indirect, incidental, consequential or otherwise), loss, liability, cost and expense (including, without limitation, reasonable attorneys and accounting fees) resulting from any claim, demand, suit, proceeding (whether before an arbitrator, court, mediator or otherwise) or investigation made by any third party (each a “Claim”) because of or arising out of: (a) your breach of these Terms of Service, including, without limitation the Merchant Agreement and any other part of these Terms of Service; (b) your improper use of the Services; (c) your breach of any applicable local, state, provincial, national or other law, rule or regulation or the rights of any third party; or (d) in the case of Owners, your NFTs or the fact that Mintickt was providing Services with respect to those NFTs, provided that in the case of (d), this indemnification shall not apply to the extent that the Claim arises out of Mintickt’s gross negligence or willful misconduct. Mintickt shall provide notice to you of any such Claim, provided that the failure or delay by Mintickt in providing such notice shall not limit your obligations hereunder except to the extent you are materially disadvantaged by such failure.",
            },
            {
              title: "Disclaimer of Warranties.",
              text: "MINTICKT PROVIDES OUR SERVICES USING A COMMERCIALLY REASONABLE LEVEL OF SKILL AND CARE AND WE TRY TO KEEP OUR SERVICES IN OPERATION, BUG-FREE AND SAFE. BUT THERE ARE CERTAIN THINGS THAT WE DO NOT PROMISE ABOUT OUR SERVICES, AND YOU USE THE SERVICES AT YOUR OWN RISK. TO THE EXTENT PERMITTED BY APPLICABLE LAWS, THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. MINTICKT HEREBY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, TITLE, NON-INFRINGEMENT AND FITNESS FOR A PARTICULAR PURPOSE. BY WAY OF EXAMPLE, MINTICKT MAKES NO WARRANTY THAT (A) THE SERVICES (OR ANY PORTION OF THE SERVICES) WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS; (B) THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; OR (c) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE. YOU ACKNOWLEDGE THAT MINTICKT HAS NO CONTROL OVER AND DOES NOT GUARANTEE THE QUALITY, SAFETY OR LEGALITY OF NFTS ADVERTISED, THE TRUTH OR ACCURACY OF ANY USERS’ (INCLUDING BUYERS’, OTHER NON-OWNERS’ AND OWNERS’) CONTENT OR LISTINGS, OR THE ABILITY OF ANY USER (INCLUDING BUYERS AND OWNERS) TO PERFORM OR ACTUALLY COMPLETE A TRANSACTION AND MINTICKT IS NOT AFFILIATED WITH AND HAS NO AGENCY OR EMPLOYMENT RELATIONSHIP WITH, ANY THIRD PARTY SERVICE PROVIDER USED IN CONJUNCTION WITH THE SERVICES, AND MINTICKT HAS NO RESPONSIBILITY FOR AND HEREBY DISCLAIMS ALL LIABILITY ARISING FROM, THE ACTS OR OMISSIONS OF ANY SUCH THIRD PARTIES.",
            },
            {
              title: "Limitation of Liability.",
              text: "TO THE EXTENT PERMITTED BY APPLICABLE LAWS, MINTICKT, AND ITS AFFILIATES AND SUBSIDIARIES, AND EACH OF ITS AND THEIR RESPECTIVE OFFICERS, DIRECTORS, AGENTS, CO-BRANDERS, LICENSORS, PAYMENT PROCESSING PARTNERS, OTHER PARTNERS, EMPLOYEES AND ANY APPLICABLE CARD SCHEMES, SHALL NOT BE LIABLE UNDER ANY CIRCUMSTANCES OR UNDER ANY LEGAL THEORY, WHETHER IN TORT, CONTRACT, OR OTHERWISE, WITH RESPECT TO THE SERVICES, OR ANY OTHER SUBJECT MATTER OF THESE TERMS OF SERVICE, INCLUDING WITHOUT LIMITATION THE MERCHANT AGREEMENT AND ANY OTHER PART OF THESE TERMS OF SERVICE, FOR: (A) ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE OR EXEMPLARY DAMAGES, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF MINTICKT HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), (B) THE COST OF PROCUREMENT OF SUBSTITUTE SERVICES, (c) ANY OF YOUR CONTENT OR ANY CONTENT OF ANY OTHER USER OF THE SERVICES, OR (D) ANY MATTERS BEYOND MINTICKT’S REASONABLE CONTROL. IN ADDITION, OTHER THAN THE OBLIGATION OF MINTICKT TO PAY OUT REGISTRATION FEES TO CERTAIN OWNERS UNDER THE MERCHANT AGREEMENT, THE MAXIMUM AGGREGATE LIABILITY OF MINTICKT, ITS PAYMENT PROCESSING PARTNERS, LICENSORS AND ANY APPLICABLE CARD SCHEMES FOR ALL DAMAGES, LOSSES, LIABILITIES, COSTS, AND EXPENSES UNDER ANY LEGAL THEORY, WHETHER IN TORT, CONTRACT, OR OTHERWISE, WITH RESPECT TO, ARISING OUT OF OR RELATED TO THE SERVICES, OR ANY OTHER SUBJECT MATTER OF THESE TERMS OF SERVICE, INCLUDING WITHOUT LIMITATION THE MERCHANT AGREEMENT AND ANY OTHER PART OF THESE TERMS OF SERVICE, SHALL BE LIMITED TO THE FEES PAYABLE BY MINTICKT OR ONE HUNDRED U.S. DOLLARS (US$100), WHICHEVER IS LESS.",
            },
            {
              title: "Exceptions.",
              text: "NOTHING IN THESE TERMS OF SERVICE IS INTENDED TO EXCLUDE OR LIMIT ANY CONDITION, WARRANTY, RIGHT, OR LIABILITY THAT MAY NOT BE LAWFULLY EXCLUDED OR LIMITED. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR CONDITIONS OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR LOSS OR DAMAGE CAUSED BY WILLFUL ACTS, NEGLIGENCE, BREACH OF CONTRACT OR BREACH OF IMPLIED TERMS, OR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, ONLY THOSE LIABILITY AND OTHER LIMITATIONS WHICH ARE LAWFUL IN YOUR JURISDICTION (IF ANY) WILL APPLY TO YOU AND OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.",
            },
            {
              title: "Release.",
              text: "Mintickt provides a marketplace in which Buyers and Owners can transact. However, Mintickt could not function if it were held responsible for the actions or inactions of Buyers, Owners and/or third parties both on and off the Services. Therefore, as an inducement to Mintickt permitting you to access and use the Services, you hereby agree to release Mintickt, and its affiliates and subsidiaries, and each of its and their respective officers, directors, agents, partners and employees from all damages (whether direct, indirect, incidental, consequential or otherwise), losses, liabilities, costs and expenses of every kind and nature, known and unknown, arising out of or in any way connected with disputes between you and third parties (including other Users) in connection with the Services or any event listed on the Services. If there is a dispute between participants on this site, or between users and any third party, you agree that Mintickt is under no obligation to become involved. In the event that you have a dispute with one or more other users, you release Mintickt, its directors, officers, employees, agents, and successors from claims, demands, and damages of every kind or nature, known or unknown, suspected or unsuspected, disclosed or undisclosed, arising out of or in any way related to such disputes and/or our Services. In addition, you waive any applicable law or statute, which says, in substance: “A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE RELEASING PARTY DOES NOT KNOW OR SUSPECT TO EXIST IN HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE RELEASED PARTY.”",
            },
            {
              title: "Trademarks.",
              text: "The trademarks, service marks, and logos of Mintickt (the “Mintickt Trademarks”) used and displayed in connection with the Services are registered and unregistered trademarks or service marks of Mintickt. Other company, product, and service names used in connection with the Services may be trademarks or service marks owned by third parties (the “Third-Party Trademarks,” and, collectively with Mintickt Trademarks, the “Trademarks”). The offering of the Services shall not be construed as granting, by implication, estoppel, or otherwise, any license or right to use any Trademark displayed in connection with the Services without the prior written consent of Mintickt specific for each such use. The Trademarks may not be used to disparage Mintickt, any third party, or Mintickt’s or such third-party’s products or services, or in any manner that may damage any goodwill in the Trademarks. Use of any Trademarks as part of a link to or from any site is prohibited unless Mintickt approves the establishment of such a link by prior written consent specific for each such link. All goodwill generated from the use of any Mintickt Trademark shall inure to Mintickt’s benefit.",
            },
            {
              title: "Patents; Copyrights.",
              text: "A number of issued patents and patents pending apply to the Services. The Content of the Services is also protected by copyrights owned by Mintickt and/or third parties. Please note that if you copy portions of the Services you are violating these patent rights and copyrights.",
            },
            {
              title: "Notices.",
              text: "Notices to you may be sent via either email or regular mail to the address in Mintickt’s records. The Services may also provide notices of changes to these Terms of Service or other matters by displaying notices or links to notices to you generally on the Services. If you wish to contact Mintickt or deliver any notice, you can do so as follows: Aries Music LLC, 16192 Coastal Highway, Lewes Delaware, 19958 USA: Legal Department Email: <a>team@mintickt.com</a>",
            },
            {
              title: "Taxes; Entire Agreement.",
              text: "You will be responsible for paying, withholding, filing, and reporting all taxes, duties, and other governmental assessments associated with your activity in connection with the Services provided that Mintickt may, in its sole discretion, do any of the foregoing on your behalf or for itself as it sees fit. The failure of either you or us to exercise, in any way, any right herein shall not be deemed a waiver of any further rights hereunder. If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated, to the minimum extent necessary, so that these Terms shall otherwise remain in full force and effect and enforceable. You and Mintickt agree that these Terms are the complete and exclusive statement of the mutual understanding between you and Mintickt and that these Terms supersede and cancel all previous written and oral agreements, communications, and other understandings relating to the subject matter of these Terms. You hereby acknowledge and agree that you are not an employee, agent, partner, or joint venture of Mintickt, and you do not have any authority of any kind to bind Mintickt in any respect whatsoever. Except as expressly set forth in the section above regarding the arbitration agreement, you and Mintickt agree there are no third-party beneficiaries intended under these Terms.",
            },
            {
              title: "Choice of Law.",
              text: "Except as set forth in Section 13.11 below, these Terms of Service and the provision of the Services to you are governed by the laws of the state of Delaware, U.S.A., without reference to principles of conflict of laws.",
            },

            {
              title: "BINDING ARBITRATION.",
              text: "ONLY FOR USERS LOCATED IN THE UNITED STATES: PLEASE READ THIS SECTION 13.11 CAREFULLY AS IT AFFECTS YOUR RIGHTS. ANY DISPUTE OR CLAIM UNDER THESE TERMS OF SERVICE OR WITH RESPECT TO THE SERVICES WILL BE SETTLED BY BINDING ARBITRATION OR IN SMALL CLAIMS COURT (TO THE EXTENT THE CLAIM QUALIFIES) AND WILL TAKE PLACE ON AN INDIVIDUAL BASIS ONLY; CLASS, CONSOLIDATED OR REPRESENTATIVE ARBITRATIONS, AND CIVIL ACTIONS ARE NOT PERMITTED ONCE THIS SECTION 13.11 IS EFFECTIVE.",
              subList: [
                {
                  title: "BINDING ARBITRATION.",
                  text: "If you have a question or concern about the Services, please contact us first. Our customer support team will try to answer your question or resolve your concern.",
                },
                {
                  title: "Agreement to Arbitrate.",
                  text: "In the unlikely event that our customer support team is unable to resolve your concerns, we each hereby agree to resolve any and all disputes or claims under these Terms of Service or with respect to the Services through binding arbitration or in small claims court (to the extent the claim qualifies) instead of in courts of general jurisdiction and only on an individual basis and not as part of any purported class, consolidated or representative proceeding. Arbitration, which is often cheaper, faster and less formal than a lawsuit in court, uses a neutral arbitrator instead of a judge or jury. Arbitrators can award the same damages and relief as a court. Binding arbitration is subject to very limited review. Only the arbitrator appointed pursuant to Section 13.11, and not any federal, state or local court or agency, shall have the authority to resolve any dispute or claim relating to Section 13.11, including, without limitation, the scope, enforceability and arbitrability of these Terms of Service. This arbitration provision shall survive termination of these Terms of Service. These Terms of Service evidence a transaction in interstate commerce and the interpretation and enforcement of Section 13.11 is governed by the Federal Arbitration Act, notwithstanding the choice of law set forth above. YOU AND MINTICKT WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO GO TO COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR JURY.",
                },
                {
                  title: "Scope of Agreement.",
                  text: "This agreement to arbitrate (“Agreement to Arbitrate”) is intended to be broadly interpreted. It includes, but is not limited to: (a) all claims arising out of or relating to any aspect of the relationship between us, whether based in contract, tort, statute, fraud, misrepresentation or any other legal theory; (b) all claims that arose before this or any prior agreement (including, but not limited to, claims relating to advertising); and (c) all claims that may arise after termination of these Terms of Service and/or your use of the Services.",
                },
                {
                  title: "Exceptions.",
                  text: "Notwithstanding this Agreement to arbitrate, either party may (a) bring an action on an individual basis in small claims court (to the extent the applicable claim qualifies), (b) bring issues to the attention of federal, state or local agencies, including, for example, the Federal Trade Commission and the ADD STATE Division of Consumer Affairs, which agencies may be able to seek relief on a party’s behalf, and (c) bring suit in court to seek a preliminary injunction or other interim relief pending the outcome of arbitration. In addition, the portion of any dispute or complaint relating to our participation in the US-EU or US-Swiss Safe Harbor Frameworks is subject to Section 14 “Dispute Resolution” of our Privacy Policy before being subject to Section 13.11 of these Terms of Service.",
                },
                {
                  title: "No Class Actions.",
                  text: "YOU AND MINTICKT AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER PURPORTED IN ANY CLASS, CONSOLIDATED OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON’S CLAIMS, MAY NOT PRESIDE OVER ANY FORM OF CLASS, CONSOLIDATED OR REPRESENTATIVE PROCEEDING, AND MAY ONLY PROVIDE RELIEF IN FAVOR OF THE INDIVIDUAL PARTY SEEKING RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE RELIEF WARRANTED BY THAT PARTY’S INDIVIDUAL CLAIM.",
                },
                {
                  title: "Notice of Dispute.",
                  text: "A party who intends to seek arbitration must first send to the other a written Notice of Dispute (“Notice”). The Notice to Mintickt must be addressed to the address above (“Notice Address”) and must be sent by certified mail. The Notice to you must be addressed to a mailing, home, or payment address currently on record with Mintickt and must be sent by certified mail. If Mintickt has no records of such physical address, such notice may be delivered to your Mintickt account email address. The Notice must (a) describe the nature and basis of the claim or dispute; and (b) set forth the specific relief sought. If Mintickt and you do not reach an agreement to resolve the claim within sixty (60) calendar days after the Notice is received, you or Mintickt may commence an arbitration proceeding.",
                },
                {
                  title: "Arbitration Proceedings.",
                  text: "Both parties agree to negotiate diligently and in good faith to resolve any disputes with regard to obligations hereunder prior to seeking other remedies. The parties each irrevocably agree that all disputes or claims that cannot be resolved in good faith shall be settled by binding final arbitration to be held in Lewes, Delaware, before a single arbitrator, pursuant to the commercial arbitration rules of JAMS. The prevailing party in any such arbitration shall be entitled to its reasonable attorneys’ fees and costs in addition to any award or injunctive relief received. The arbitrator shall issue a reasoned written decision sufficient to explain the essential findings and conclusions on which the award is based. All decisions by the arbitrator shall be final and binding and judgment on the award rendered may be entered in any US court having jurisdiction.",
                },
                {
                  title: "Legal Fees.",
                  text: "Just as in any court proceeding, each party will initially bear its own attorneys’ fees and expenses in connection with any arbitration. Should either party be determined to have substantially prevailed in the arbitration, then upon such party’s request, the arbitrator shall award such prevailing party the reasonable attorneys’ fees and expenses that it incurred in connection with the arbitration, provided that to the extent that the dispute or claim relate to your personal or household use of the Services (rather than business use), Mintickt will not seek to recover its attorneys’ fees and expenses in an arbitration initiated by you. The arbitrator may make rulings and resolve disputes as to the reimbursement of attorneys’ fees and expenses upon request from either party made within fourteen (14) days of the arbitrator’s ruling on the merits.",
                },
                {
                  title: "Future Changes.",
                  text: "Notwithstanding any provision in these Terms of Service to the contrary, you and Mintickt agree that if Mintickt makes any future change to this arbitration provision (other than a change to the Notice Address) Mintickt will provide you with notice of such change and you may reject any such change by sending us written notice within thirty (30) calendar days of the change to the Notice Address provided above. By rejecting any future change, you are agreeing that you will arbitrate any dispute between us in accordance with the language of this provision as unmodified by such rejected change.",
                },
                {
                  title: "Special Severability.",
                  text: "In the event that the provisions of Section 13.11 are found to be invalid or unenforceable for any dispute or claim, then, notwithstanding Section 13.12, the entirety of Section 13.11 shall be null and void with respect to such dispute or claim.",
                },
                {
                  title: "Opt Out.",
                  text: "We believe that on a whole this agreement to arbitrate will benefit our Users. For new registered users and existing registered users who register new accounts, there is no option to opt-out and this provision will be effective as to such new accounts upon account creation. For unregistered Buyers and other Users, this provision will apply to all future activities on the Services.",
                },
              ],
            },

            {
              title: "Waiver; Invalid Provisions.",
              text: "The failure or delay of Mintickt to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. No oral waiver, amendment or modification shall be effective under any circumstance whatsoever. If any provision of these Terms of Service is found by an arbitrator or court of competent jurisdiction to be invalid, the parties nevertheless agree that the arbitrator or court should endeavor to give effect to the parties’ intentions as reflected in the provision, and the other provisions of these Terms of Service shall remain in full force and effect.",
            },
            {
              title: "Judicial Forum.",
              text: "In the event that the Agreement to Arbitrate above is found not to apply to you or to a particular claim or dispute, either as a result of your decision to opt-out of the Agreement to Arbitrate or for any other reason, then any dispute or claim not subject to arbitration shall be resolved exclusively by a federal court located in Lewes, Delaware, and to the extent, there is no subject matter jurisdiction in such federal court, then a Delaware court in Delaware Superior Court, Delaware. Both you and Mintickt agree to submit to the personal jurisdiction and venue of such courts and agree that such forum is convenient.",
            },
            {
              title: "Titles.",
              text: "Any section titles in these Terms of Service are for convenience only and have no legal or contractual effect.",
            },
            {
              title: "Violations.",
              text: "Please report any violations of these Terms of Service by email.",
            },
            {
              title: "Assignment.",
              text: "We may, without your consent or approval, freely assign these Terms of Service and our rights and obligations under these Terms of Service, whether to an affiliate or to another entity in connection with a corporate transaction or otherwise.",
            },
            {
              title: "Relationship.*",
              text: "No independent contractor, agency, partnership, joint venture, employer-employee or franchiser-franchisee relationship is intended or created by these Terms of Service, except to the extent expressly set forth in these Terms of Service or the Merchant Agreement.",
            },
          ]
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
