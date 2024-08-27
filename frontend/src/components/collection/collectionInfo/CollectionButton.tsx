import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CollectionButtonProps {
    buttonText: string;
    tooltipText: string;
}

export function CollectionButton({
    buttonText,
    tooltipText,
}: CollectionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button>{buttonText}</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}
