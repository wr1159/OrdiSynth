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
    buttonClassName?: string;
}

export function CollectionButton({
    buttonText,
    tooltipText,
    handleOpen,
    buttonClassName,
}: CollectionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={handleOpen} className={buttonClassName}>
                    {buttonText}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}
