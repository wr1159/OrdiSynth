import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TraitsTableProps {
    traits: { name: string; value: string }[];
}

export function TraitsTable({ traits }: TraitsTableProps) {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Traits</AccordionTrigger>
                <AccordionContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">
                                    Value
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {traits.map((trait) => (
                                <TableRow key={trait.name}>
                                    <TableCell className="font-medium">
                                        {trait.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {trait.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
