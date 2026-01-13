export interface CardData {
  id: string;
  name: string;
  image: string;
  rating: number;
  creditScoreText: string;
  greatFor: string[];
  annualFee: string;
  bonusOffers: string;
  rewardsRate: string;
  introAPR: string;
  ongoingAPR: string;
  pros: string[];
  cons: string[];
  applyUrl: string;
  keyLifestyleBenefits?:string
}
