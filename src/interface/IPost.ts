export interface IMediaItem {
    id: string;
    url: string;
    alt: string;
}

export interface IPostItem {
    id: string;
    title: string;
    extract: string;
    text: string;
    slug: string;
    expires_at: Date;
    html_content: string;
    media: IMediaItem;
    author_id: string;
}


export interface IPostCreationPayload {
    title: string,
    html_content: string
}