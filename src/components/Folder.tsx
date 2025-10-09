import React from "react";
import {FcOpenedFolder} from "react-icons/fc";
import {useSetAtom} from "jotai/index";
import {folderClickAtom} from "@/store/fileManagerAtoms";

const Folder = ({name}: any) => {
    const handleFolderClick = useSetAtom(folderClickAtom);
    return (
        <article
            className="flex flex-col text-center items-center cursor-pointer text-xs w-[100px]"
        >
            <FcOpenedFolder
                className="text-[50px]"
                onClick={() => handleFolderClick(name)}
            />
            <span className="break-words mt-2">
                {name.length > 20 ? name.slice(0, 20) + "..." : name}
            </span>
        </article>
    );
};
export default Folder;
