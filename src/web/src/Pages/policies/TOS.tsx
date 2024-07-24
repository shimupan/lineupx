import React from 'react';
import { Header, Footer, SideNavWrapper, BottomNav } from '../../Components';
import useIsMobile from '../../hooks/isMobile';

const TOS: React.FC = () => {
   const isMobile = useIsMobile();
   return (
      <>
         <Header />
         {!isMobile && <SideNavWrapper />}
         <div className="flex flex-col min-h-screen items-center">
            <div className="flex-1 pt-16 px-8 text-white sm:pl-8 md:pl-64 lg:pl-64 text-sm md:text-base lg:text-lg max-w-6xl">
               <h1 className="text-6xl font-bold text-blue-500 mb-8 text-center">
                  LineupX Terms of Service DATE OF LAST REVISION: 7 June 2024
               </h1>
               <p>
                  IMPORTANT, PLEASE READ THESE ONLINE TERMS OF USE CAREFULLY.
                  Welcome to www.lineupx.net/. LineupX (hereafter referred to as
                  “LineupX”, “we”, “us”, or “our”) provides a platform for
                  online courses (collectively, the “Services”), which Services
                  are accessible at www.lineupx.net/ and any other websites
                  through which LineupX makes the Services available
                  (collectively, the “Site”). The Site and Services are offered
                  to you conditioned on your acceptance without modification of
                  the terms, conditions, and notices contained herein (the
                  “Terms”). Your use of the Site and Services constitutes your
                  agreement to all such Terms. Please read these terms
                  carefully, and keep a copy of them for your reference. We
                  reserve the right to update or modify these Terms at any time
                  without prior notice to you, and your continued use of the
                  Site following LineupX’s posting of any changes will
                  constitute your acceptance of such changes or modifications.
                  We encourage you to review these Terms whenever you use the
                  Site.
               </p>
               <Section
                  title="Privacy"
                  content="Your use of the Site and Services are subject to LineupX’s Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices. LineupX does not knowingly collect, either online or offline, personal information from persons under the age of 13."
               />
               <Section
                  title="Eligibility"
                  content="
                    The Site and Services are intended solely for persons who are 13 or older. Any access to or use of the Site or Services by anyone under 13 is expressly prohibited. By accessing or using the Site or Services you represent and warrant that you are 13 or older. As a condition of your use of the Service, you agree to (a) provide LineupX with true, accurate, current and complete information as prompted by the LineupX registration forms, when registering for or using the Service and (b) update and maintain the truthfulness, accuracy and completeness of such information."
               />

               <Section
                  title="Your Account"
                  content="
If you use the Site or Services, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity. You acknowledge that LineupX is not responsible for third-party access to your account that results from theft or misappropriation of your account. LineupX and its associates reserve the right to refuse or cancel service, terminate accounts, or remove or edit content in our sole discretion."
               />
               <Section
                  title="Links to Third Party Sites/Third Party Services"
                  content="
The Site and Services contain links to other websites (“Linked Sites”). The Linked Sites are not under the control of LineupX and LineupX assumes no responsibility for, the content, privacy policies, or practices of any third-party websites, and you access and use these websites solely at your own risk. LineupX is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by LineupX of the site or any association with its operators. By using the Site or Services, you expressly relieve LineupX from any and all liability arising from your use of any third-party website and from any loss or damage of any sort you may incur from dealing with any third party. It is up to you to take appropriate precautions to ensure that any website you visit is free of destructive items such as worms or viruses. We encourage you to be aware when you leave the Site and to read the terms and conditions of use for each other website that you visit.

Certain services made available via the Site or Services are delivered by third-party sites and organizations. By using any product, service or functionality originating from the Site, you hereby acknowledge and consent that LineupX may share such information and data with any third party with whom LineupX has a contractual relationship to provide the requested product, service or functionality on behalf of users and customers of the Site or Services."
               />
               <Section
                  title="No Unlawful or Prohibited Use/Intellectual Property"
                  content="You are granted a non-exclusive, non-transferable, revocable license to access and use the Site and Services strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to LineupX that you will not use the Site for any purpose that is unlawful or prohibited by these Terms.

All content included as part of the Site and Services, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site or in the Application, is the property of LineupX, its suppliers or third-parties and protected by trademark, copyright and other laws that protect intellectual property and proprietary rights. You agree to observe and abide by all trademark, copyright and other proprietary notices, legends or other restrictions contained in any such content and will not make any changes thereto, including without limitation altering any proprietary rights or attribution notices in any such content. Access to the Site and Services does not authorize anyone to use any of LineupX’s names, logos or marks, including without limitation the LineupX trademark or logo, or any other intellectual property in any manner. The content on the Site may be used only as an information resource, and LineupX content is not for resale. You will use protected content solely for your personal, non-commercial use, and will make no other use of the content without the express written permission of LineupX and the copyright owner. You agree that you do not acquire any ownership rights in any protected content. We utilized the Terms of Service Generator to draft our own document. We do not grant you any licenses, express or implied, to the intellectual property of LineupX or our licensors except as expressly authorized by these Terms. Any other use, including the reproduction, modification, distribution, transmission, republication, display, or performance, of the content on the Site is strictly prohibited.


Further, in your use of the Site and Services, you may not:

modify, publish, transmit, reverse engineer, participate in the transfer or sale, create derivative works, or in any way exploit any of the content, in whole or in part, found on the Site or the Application;
use web crawlers, web robots, web scutters, ants, automatic indexers, bots, worms, and other such devices in connection with the Site; provided, however, that general purpose Internet search engines and non-commercial public archives that use tools to gather information for the sole purpose of displaying hyperlinks to the Site are granted a limited exception from the foregoing exclusion, provided that they do so from a stable IP address or range of IP addresses using an easily-identifiable agent;
use the Site in any manner that could damage, disable, overburden, or impair the Site or interfere with any other party’s use of the Site;
obtain or attempt to obtain any content through any means not intentionally made available or provided for through the Site;
remove, modify, disable, block, obscure or otherwise impair any advertising in connection with the Site;
collect personally identifiable information of other users or visitors;
harvest information about users for the purpose of sending, or to facilitate or encourage the sending of, unsolicited bulk or other communications; or
post or transmit any worms, viruses, Trojans, or other harmful, disruptive, or destructive files, code, or programs to the Site.

LineupX will fully cooperate with any law enforcement authorities or court order requesting or directing LineupX to disclose the identity of anyone violating these Terms.

In its sole discretion, in addition to any other rights or remedies available to and without any liability whatsoever, LineupX may at any time and without notice may terminate or restrict your access to any component of the Site."
               />
               <Section
                  title="Electronic Communications/Notice"
                  content="Visiting or using the Site or Services or sending emails to LineupX constitutes electronic communications. You consent to receiving electronic communications, and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email or by posting the notices on the Site satisfy any legal requirement that such communications be in writing. All notices to LineupX will be provided by sending an email to lineupx@lineupx.net. Such notices will be deemed delivered upon the earlier of the verification of delivery or two (2) business days after being sent."
               />
               <Section
                  title="Use of Communication Services
"
                  content="
The Site may contain bulletin board services, blogs, chat areas, news groups, forums, communities, personal web pages, calendars, and/or other message or communication facilities designed to enable you to communicate with the public at large or with a group (collectively, “Communication Services”), you agree to use the Communication Services only to post, send and receive messages and material that are proper and related to the particular Communication Service.


By way of example, and not as a limitation, you agree that when using a Communication Service, you will not:

defame, abuse, harass, stalk, threaten or otherwise violate the legal rights (such as rights of privacy and publicity) of others;
publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topic, name, material or information;
upload files that contain software or other material protected by intellectual property laws (or by rights of privacy of publicity) unless you own or control the rights thereto or have received all necessary consents;
upload files that contain viruses, corrupted files, or any other similar software or programs that may damage the operation of another’s computer;
advertise or offer to sell or buy any goods or services for any business purpose, unless such Communication Service specifically allows such messages;
conduct or forward surveys, contests, pyramid schemes or chain letters;
download any file posted by another user of a Communication Service that you know, or reasonably should know, cannot be legally distributed in such manner;
falsify or delete any author attributions, legal or other proper notices or proprietary designations or labels of the origin or source of software or other material contained in a file that is uploaded, restrict or inhibit any other user from using and enjoying the Communication Services;
violate any code of conduct or other guidelines which may be applicable for any particular Communication Service;
harvest or otherwise collect information about others, including e-mail addresses, without their consent; or
violate any applicable laws or regulations.

LineupX has no obligation to monitor the Communication Services. However, LineupX reserves the right to review materials posted to a Communication Service and to remove any materials in its sole discretion. LineupX reserves the right to terminate your access to any or all of the Communication Services at any time without notice for any reason whatsoever.

LineupX reserves the right at all times to disclose any information as necessary to satisfy any applicable law, regulation, legal process or governmental request, or to edit, refuse to post or to remove any information or materials, in whole or in part, in LineupX’s sole discretion.

Always use caution when giving out any personally identifying information about yourself or your children in any Communication Service. LineupX does not control or endorse the content, messages or information found in any Communication Service and, therefore, LineupX specifically disclaims any liability with regard to the Communication Services and any actions resulting from your participation in any Communication Service. Managers and hosts are not authorized LineupX spokespersons, and their views do not necessarily reflect those of LineupX.

Materials uploaded to a Communication Service may be subject to posted limitations on usage, reproduction and/or dissemination. You are responsible for adhering to such limitations if you upload the materials.

Materials Provided to LineupX or Posted on Any LineupX Web PageLineupX does not claim ownership of the materials you provide to LineupX (including feedback and suggestions) or post, upload, input or submit to any LineupX Site or our associated services (collectively “Submissions”). However, by posting, uploading, inputting, providing or submitting your Submissions you are granting LineupX, our affiliated companies and necessary sublicensees an irrevocable, perpetual, non-exclusive, fully paid, worldwide license to use your Submissions in connection with the operation of the Site or Services or our affiliated companies’ Internet businesses including, without limitation, the rights to: copy, distribute, transmit, publicly display, publicly perform, reproduce, edit, translate and reformat your Submissions; and to publish or refrain from publishing your name in connection with your Submissions.

No compensation will be paid with respect to the use of your Submissions, as provided herein. LineupX is under no obligation to post or use any Submissions you may provide and may remove any Submissions at any time in LineupX’s sole discretion.

By posting, uploading, inputting, providing or submitting your Submissions, you warrant and represent that you own or otherwise control all of the rights to your Submissions as described in this Section including, without limitation, all the rights necessary for you to provide, post, upload, input or submit the Submissions and the rights granted to LineupX herein.

"
               />

               <Section
                  title="No Endorsement"
                  content="LineupX does not endorse any of the courses about which information is provided via the Site or Services. You are responsible for determining the identity and suitability of others whom you contact via the Site or Services. We will not be responsible for any damage or harm resulting from your interactions with any online course providers. Your dealings with online course providers and any other terms, conditions, representations or warranties associated with such dealings, are between you and such online course providers exclusively and do not involve LineupX. You should make whatever investigation or other resources that you deem necessary or appropriate before signing up for any online courses.

By using the Site or Services, you agree that any legal remedy or liability that you seek to obtain for actions or omissions of any online course providers or other third parties will be limited to a claim against the particular online course providers or other third parties who caused you harm, and you agree not to attempt to impose liability on, or seek any legal remedy from LineupX with respect to such actions or omissions and hereby release LineupX from any and all liability for or relating to any interactions or dealings with online course providers.

"
               />
               <Section
                  title="International Users"
                  content="The Site and Services are controlled, operated and administered by LineupX from our offices within the United States If you access the Site or Services from a location outside the United States, you are responsible for compliance with all local laws. You agree that you will not use the LineupX content accessed through the Site or Services in any country or in any manner prohibited by any applicable laws, restrictions or regulations."
               />
               <Section
                  title="No Endorsement"
                  content="Visiting or using the Site or Services or sending emails to LineupX constitutes electronic communications. You consent to receiving electronic communications, and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email or by posting the notices on the Site satisfy any legal requirement that such communications be in writing. All notices to LineupX will be provided by sending an email to lineupx@lineupx.net. Such notices will be deemed delivered upon the earlier of the verification of delivery or two (2) business days after being sent."
               />
               <Section
                  title="Indemnification"
                  content="
You agree to indemnify, defend and hold harmless LineupX, its officers, directors, employees, agents and third parties, for any losses, costs, liabilities and expenses (including reasonable attorneys’ fees) relating to or arising out of your use of or inability to use the Site or Services; any user postings made by you; your violation of these Terms; your violation of any rights of a third party; or your violation of any applicable laws, rules or regulations. LineupX reserves the right, at its own cost and sole discretion, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with LineupX in asserting any available defenses."
               />
               <Section
                  title="Warranty and Liability Disclaimer"
                  content="
The information, software, products, and services included in or available through the Site or Services may include inaccuracies or typographical errors. Changes are periodically added to the information herein. LineupX and/or its suppliers may make improvements and/or changes in the site at any time.

LineupX and/or its suppliers make no representations about the suitability, reliability, availability, timeliness, and accuracy of the information, software, products, services and related graphics contained on the site for any purpose. To the maximum extent permitted by applicable law, all such information, software, products, services and related graphics are provided “as is” without warranty or condition of any kind. LineupX and/or its suppliers hereby disclaim all warranties and conditions with regard to this information, software, products, services and related graphics, including all implied warranties or conditions of merchantability, fitness for a particular purpose, title and non-infringement.

YOU EXPRESSLY UNDERSTAND AND AGREE THAT LineupX WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, COMPENSATORY, CONSEQUENTIAL OR EXEMPLARY DAMAGES (EVEN IF LineupX HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES) (COLLECTIVELY, “DAMAGES”), RESULTING FROM: (A) THE USE OR INABILITY TO USE THE SERVICE; (B) THE COST OF ANY GOODS AND/OR SERVICES PURCHASED OR OBTAINED AS A RESULT OF THE USE OF THE SERVICE; (C) DISCLOSURE OF, UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR INFORMATION OR CONTENT; (D) CONTENT YOU SUBMIT, RECEIVE, ACCESS, TRANSMIT OR OTHERWISE CONVEY THROUGH THE SERVICE; (E) STATEMENTS OR CONDUCT OF ANY ONLINE COURSE PROVIDERS OR OTHER THIRD PARTY THROUGH THE SERVICE; (F) ANY OTHER MATTER RELATING TO THE SERVICE; (G) ANY BREACH OF THIS AGREEMENT BY LineupX OR THE FAILURE OF LineupX TO PROVIDE THE SERVICE UNDER THIS AGREEMENT OR (H) ANY OTHER DEALINGS OR INTERACTIONS YOU HAVE WITH ANY ONLINE COURSE PROVIDERS (OR ANY OF THEIR REPRESENTATIVES OR AGENTS). THESE LIMITATIONS SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW. In some jurisdictions, limitations of liability are not permitted. In such jurisdictions, some of the foregoing limitations may not apply to You.

"
               />
               <Section
                  title="Termination/Access Restriction"
                  content="
LineupX reserves the right, in its sole discretion, to terminate your access to the Site and Services and the related services or any portion thereof at any time, without notice.

"
               />
               <Section
                  title="Governing Law/Dispute Resolution"
                  content="To the maximum extent permitted by law, this agreement is governed by the laws of the State of Washington and you hereby consent to the exclusive jurisdiction and venue of courts in Washington in all disputes arising out of or relating to the use of the Site. Use of the Site and Services is unauthorized in any jurisdiction that does not give effect to all provisions of these Terms, including, without limitation, this Section. LineupX’s performance of this agreement is subject to existing laws and legal process, and nothing contained in this agreement is in derogation of LineupX’s right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or Services or information provided to or gathered by LineupX with respect to such use.

Except for claims for injunctive or equitable relief or claims regarding intellectual property rights (which may be brought in any competent court without the posting of a bond), any dispute arising under these Terms shall be finally settled in accordance with the Comprehensive Arbitration Rules of the Judicial Arbitration and Mediation Service, Inc. (“JAMS”) by a single arbitrator appointed in accordance with such Rules. The arbitration shall take place in King County, Washington, in the English language and the arbitral decision may be enforced in any court in any jurisdiction. The prevailing party in any action or proceeding to enforce these Terms shall be entitled to costs and attorneys’ fees.

"
               />
               <Section
                  title="No Joint Venture"
                  content="You agree that no joint venture, partnership, employment, or agency relationship exists between you and LineupX as a result of this agreement or use of the Site or Services."
               />
               <Section
                  title="Entire Agreement"
                  content="
Unless otherwise specified herein, this agreement constitutes the entire agreement between you and LineupX with respect to the Site or Services and it supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written, between the user and LineupX with respect to the Site. A printed version of this agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent an d subject to the same conditions as other business documents and records originally generated and maintained in printed form. It is the express wish to the parties that this agreement and all related documents be written in English.

If any part of this agreement is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the agreement shall continue in effect. These Terms will be binding upon and will inure to the benefit of the parties, their successors and permitted assigns."
               />
               <Section
                  title="Changes to Terms"
                  content="LineupX reserves the right, in its sole discretion, to change the Terms under which the Site and Services are offered, and such modification(s) will be effective immediately upon being posted on our Site (www.lineupx.net/). The most current version of the Terms will supersede all previous versions. LineupX encourages you to periodically review the Terms to stay informed of our updates. Your continued use of the Site or Services after such modifications will be deemed to be your conclusive acceptance of all modifications to this Agreement. If you are dissatisfied as a result of such modification(s), your only recourse is to immediately discontinue use of the Site or Services.

"
               />
               <Section
                  title="
Contact Us"
                  content="LineupX welcomes your questions or comments regarding the Terms by emailing us at lineupx@lineupx.net.

IF YOU DO NOT AGREE TO ALL OF THE TERMS AND CONDITIONS OF THIS AGREEMENT, YOU MUST NOT USE THE SERVICE. BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THE TERMS AND CONDITIONS OF THIS AGREEMENT AND YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS."
               />
            </div>
         </div>
         <Footer />
         <div style={{ paddingTop: '80px' }}>{isMobile && <BottomNav />}</div>
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

export default TOS;
