export interface ImageCard {
    headerTitle: string;
    imageUrl: string;
    footerContent?: string;
    routePart?: string
}

export interface Filter {
    filterType: string,
    noOfCells: number
}