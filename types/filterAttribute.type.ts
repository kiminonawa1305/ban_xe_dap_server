export default interface FilterAttributeType{
    brands: string[],
    prices: {min: number, max: number},
    wheelSizes: string[],
    materials: string[],
    targetUsings: string[],
}
