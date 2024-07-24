import React from 'react';
import { Layout } from '../../Components';

const PrivatePolicy: React.FC = () => {
   return (
      <>
         <Layout>
            <div className="flex flex-col min-h-screen items-center">
               <div className="flex-1 pt-16 px-8 text-white sm:pl-8 md:pl-64 lg:pl-64 text-sm md:text-base lg:text-lg max-w-6xl">
                  <h1 className="text-6xl font-bold text-blue-500 mb-8 text-center">
                     LineupX Data Use and Privacy Policy
                  </h1>
                  <p>
                     LineupX operates the https://www.lineupx.net/ website,
                     which provides the SERVICE. This page is used to inform
                     website visitors regarding our policies with the
                     collection, use, and disclosure of Personal Information if
                     anyone decided to use our Service, the LineupX website. If
                     you choose to use our Service, then you agree to the
                     collection and use of information in relation with this
                     policy. The Personal Information that we collect are used
                     for providing and improving the Service. We will not use or
                     share your information with anyone except as described in
                     this Privacy Policy. The terms used in this Privacy Policy
                     have the same meanings as in our Terms and Conditions,
                     which is accessible at https://www.lineupx.net/, unless
                     otherwise defined in this Privacy Policy.
                  </p>
                  <Section
                     title="Information Collection and Use"
                     content="All information we gather is for improving the user experience. If you decide to sign up as a user of LineupX, the only personally identifiable information we collect is your email. The account creation proccess is optional."
                  />
                  <Section
                     title="Cookies"
                     content="Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer's hard drive. Lineupx uses these cookies to collection information, authenticate users, and improve security. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service."
                  />
                  <Section title="Service Providers" content="" />
                  <Section
                     title={
                        <h2 className="text-lg font-bold">Zoho Mail API</h2> // Change this line
                     }
                     content={
                        <>
                           We run Google Ads on LineupX, by using our service
                           you agree to the Google Ads privacy policy and terms
                           of service which can be found{' '}
                           <a
                              href="https://policies.google.com/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-500 underline"
                           >
                              here
                           </a>
                           .
                        </>
                     }
                  />
                  <Section
                     title={
                        <h2 className="text-lg font-bold">Zoho Mail API</h2> // Change this line
                     }
                     content={
                        <>
                           To send emails to the users we use Nodemailer with
                           the Zoho Mail API. By signing up with an email
                           account you agree to the terms outlined.{' '}
                           <a
                              href="https://www.zoho.com/privacy.html"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-500 underline"
                           >
                              here
                           </a>
                           .
                        </>
                     }
                  />
                  <Section
                     title="Security"
                     content="We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security."
                  />
                  <Section
                     title="Links to Other Sites"
                     content="Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services"
                  />
                  <Section
                     title="Change to This Privacy Privacy"
                     content="We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page."
                  />
                  <Section
                     title="Contact Us"
                     content="If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at the email lineupx@lineupx.net."
                  />
               </div>
            </div>
         </Layout>
      </>
   );
};

const Section: React.FC<{
   title: React.ReactNode;
   content: React.ReactNode;
}> = ({ title, content }) => (
   <div className="mb-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">{title}</h1>
      <p>{content}</p>
   </div>
);

export default PrivatePolicy;
