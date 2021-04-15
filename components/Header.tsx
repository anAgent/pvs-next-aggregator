export interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  return <h1 className="title">{title}</h1>;
}
