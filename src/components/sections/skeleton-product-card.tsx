export default function ProductCardSkeleton() {
    return (
        <div className="relative bg-card border border-border rounded-lg p-4 flex flex-col h-full shadow-sm animate-pulse">

            {/* Heart button */}
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-muted" />

            {/* Discount badge */}
            <div className="flex items-center gap-1.5">
                <div className="h-5 w-12 bg-muted rounded-sm" />
            </div>

            {/* Image */}
            <div className="relative h-48 w-full mx-auto my-3 flex items-center justify-center">
                <div className="h-36 w-36 bg-muted rounded-md" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                {/* Store name */}
                <div className="h-3 w-20 bg-muted rounded mb-2" />

                {/* Title (2 lines) */}
                <div className="space-y-2 mb-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-4/5 bg-muted rounded" />
                </div>

                {/* Price */}
                <div className="mt-auto pt-2 border-t border-border">
                    <div className="h-4 w-24 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}
