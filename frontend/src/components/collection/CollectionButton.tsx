import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CollectionButtonProps {
    buttonText: string;
    tooltipText: string;
    handleOpen?: () => void;
}

export function CollectionButton({
    buttonText,
    tooltipText,
    handleOpen,
}: CollectionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleOpen}>{buttonText}</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}
