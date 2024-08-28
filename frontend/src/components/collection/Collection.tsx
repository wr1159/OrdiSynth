import { CollectionInfo } from "./collectionInfo/CollectionInfo";
import { OrdinalDetails } from "./ordinalDetails/OrdinalDetails";

export function Collection() {
    const ordinalsInLp = ["1", "2", "3"];

    return (
        <>
            <CollectionInfo />
            <div className="grid grid-cols-6 gap-4 m-8">
                {ordinalsInLp.map((item) => (
                    <OrdinalDetails showOrdinal={item} />
                ))}
            </div>
        </>
    );
}
