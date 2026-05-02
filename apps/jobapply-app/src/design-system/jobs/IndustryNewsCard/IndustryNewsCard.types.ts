export interface NewsItem {
  thumbnail: string
  title: string
  source: string
  time: string
}

export interface IndustryNewsCardProps {
  news: NewsItem[]
}
