import { FC } from 'react';
import { BackgroundEditor } from '../BackgroundEditor';
import { useBackgroundContext } from '../../context/BackgroundContext';

export const GlobalBackgroundEditor: FC = () => {
  const { updateBackgroundImage } = useBackgroundContext();

  return <BackgroundEditor onBackgroundChange={updateBackgroundImage} />;
};

