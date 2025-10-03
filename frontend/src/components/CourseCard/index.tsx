import type { FC } from 'react';
import { Button } from '../Button';
import { 
  CardWrapper, 
  ImageWrapper, 
  CardImage, 
  ContentWrapper, 
  Title, 
  Description,
  ButtonWrapper
} from './styles';

type CourseCardProps = {
  image: string;
  title: string;
  description: string;
  to: string;
};

export const CourseCard: FC<CourseCardProps> = ({ image, title, description, to }) => {
  return (
    <CardWrapper>
      <ImageWrapper>
        <CardImage src={image} alt={`Imagem para o curso ${title}`} />
      </ImageWrapper>
      <ContentWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ButtonWrapper>
          <Button onClick={() => console.log(`Navegando para ${to}`)}>
            Ver Curso
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </CardWrapper>
  );
};