import React from "react";
import {useSetAtom} from "jotai/index";
import {folderClickAtom} from "@/store/fileManagerAtoms";
import {FcFile} from "react-icons/fc";

const File = ({name, handleDownloadFile, id}: any) => {
    const handleFolderClick = useSetAtom(folderClickAtom);
    return (
        <article
            className="flex flex-col text-center items-center cursor-pointer text-xs w-[100px]"
        >
            <span className="relative flex items-center justify-center">
                <FcFile
                    className="text-[50px] cursor-pointer"
                    strokeWidth="0.0001"
                    onClick={() => handleDownloadFile({fileId: id, fileName: name})}
                />
                 {name?.toLowerCase()?.endsWith(".pdf")
                     && <span className="absolute text-white pt-1 font-extrabold">PDF</span>
                 }
            </span>
            <span className="break-words mt-2">
                {name.length > 20 ? name.slice(0, 20) + "..." : name}
            </span>
        </article>
    );
};
export default File;
