import type { NormalizedMobileSpecs } from "@/lib/products/types";

export function isMobileOffer(
    current: NormalizedMobileSpecs,
    candidate: NormalizedMobileSpecs
): boolean {
    return (
        !!current.model &&
        !!current.color &&
        current.ramGb !== null &&
        current.storageGb !== null &&
        !!candidate.model &&
        !!candidate.color &&
        candidate.ramGb !== null &&
        candidate.storageGb !== null &&
        current.model === candidate.model &&
        current.color === candidate.color &&
        current.ramGb === candidate.ramGb &&
        current.storageGb === candidate.storageGb
    );
}