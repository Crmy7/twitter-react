export interface Post {
  id: number;
  content: string;
  username: string; // Remplace "author"
  imageUrl?: string | null; // Ajout de l'optionnalité
  createdAt: string; // Ajout de la date
}
