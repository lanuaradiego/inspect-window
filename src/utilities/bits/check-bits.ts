export default function checkBits(num: number, mask: number): boolean {
	return (num & mask) == mask;
}