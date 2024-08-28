import { CollectionInfo } from "./collectionInfo/CollectionInfo";
import ordinal from "@/images/ordinal.svg";

export function Collection() {
    const ordinalsInLp = ["1", "2", "3"];

    return (
        <>
            <CollectionInfo />
            <div className="grid grid-cols-6 gap-4 m-8">
                {ordinalsInLp.map((item) => (
                    <div className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground gap-4">
                        <img src={ordinal} className="rounded w-32" />
                        Pizza Ninja #{item}
                    </div>
                ))}
            </div>
        </>
    );
}
