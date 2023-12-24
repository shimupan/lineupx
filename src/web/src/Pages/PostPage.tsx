import { useLocation } from "react-router-dom";
import { Header, Footer, SideNavWrapper } from '../Components';
import { CDN_URL } from "../Constants";

const PostPage = () => {
    const location = useLocation();
    const postData = location.state.postData;
    return (
       <>
          <Header />

          <SideNavWrapper />
          
          <div className="flex flex-col items-center">
             <h1 className="text-2xl font-bold mb-4 pt-3">{postData.postTitle}</h1>
             <img
                src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                alt={postData.postTitle}
                className="w-3/5 h-auto mb-4"
             />
             <img
                src={`${CDN_URL}/${postData.standingPosition.public_id}`}
                alt={postData.postTitle}
                className="w-3/5 h-auto mb-4"
             />
             <img
                src={`${CDN_URL}/${postData.aimingPosition.public_id}`}
                alt={postData.postTitle}
                className="w-3/5 h-auto mb-4"
             />
             <p className="text-base">{postData.description}</p>
          </div>

          <Footer />
       </>
    );
};

export default PostPage;