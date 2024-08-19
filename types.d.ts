type UserType = {
    _id: string;
    collectionName: string;
    wallet: string;
    email: string;
    username: string;
    contractAdd: string;
    profileImage: string;
    readlist: Array<string>;
    yourBooks: Array<string>;
    mintedBooks: Array<string>;
    searchHistory: Array<string>;
    role: string
  }

  type BookType = {
    _id:string;
    name: string;
    isPublished?: boolean;
    isHidden?: boolean;
    price?: number;
    tokenId: number;
    contractAddress: string;
    maxMint?: number;
    cover?: string | null;
    author: Object | null;
    artist?: string | null;
    minted?: number;
    ISBN?: string | null;
    description?: string | null;
    tags?: string[];
    pdf: string;
    readers?: number;
    isBoosted?: string | null;
    createdAt?: Date;
  }
