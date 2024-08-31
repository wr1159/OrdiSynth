import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CollectionButtonProps {
    buttonText: string;
    tooltipText: string;
    onClick?: () => void;
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function CollectionButton({
    buttonText,
    tooltipText,
    onClick,
    buttonProps,
}: CollectionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button onClick={onClick} {...buttonProps}>
                    {buttonText}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}
