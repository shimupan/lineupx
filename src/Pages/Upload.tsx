import { useState } from "react";
import { Dropzone } from "../Components";

const Upload: React.FC = () => {
    const [standingPositing, setStandingPosition] = useState<File[]>([]);
    const [aimingPosition, setAimingPosition] = useState<File[]>([]);
    const [landingPosition, setLandingPosition] = useState<File[]>([]);
    return (
        <div className="">
            <Dropzone setFile={setStandingPosition}/>
            <Dropzone setFile={setAimingPosition}/>
            <Dropzone setFile={setLandingPosition}/>
        </div>
    );
};

export default Upload;