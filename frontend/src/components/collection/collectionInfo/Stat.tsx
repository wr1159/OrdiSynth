interface StatProps {
    heading: string;
    amount: string;
    className?: string;
}

export function Stat({ heading, amount, className }: StatProps) {
    return (
        <div className={className}>
            <h3 className="md:text-2xl font-semibold">{heading}</h3>
            <p className="md:text-lg text-muted-foreground">{amount}</p>
        </div>
    );
}
