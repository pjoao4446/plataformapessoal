// ARQUIVO: src/components/Dropdown/index.tsx (VERSÃO COMPLETA E CORRIGIDA)

import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // 1. Importe o ícone da seta
import { 
  DropdownWrapper, 
  DropdownButton, 
  Submenu, 
  SubmenuItem,
  IconWrapper // 2. Importe o nosso novo estilo
} from './styles';

type DropdownItem = {
  label: string;
  to: string;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
};

export const Dropdown: FC<DropdownProps> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownWrapper
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownButton as="div">
        {trigger}
        
        {/* 3. ADICIONE O ÍCONE AQUI, DENTRO DO BOTÃO */}
        <IconWrapper $isOpen={isOpen}>
          <FiChevronDown size={16} />
        </IconWrapper>

      </DropdownButton>
      {isOpen && (
        <Submenu>
          {items.map((item) => (
            <SubmenuItem key={item.to} to={item.to}>
              {item.label}
            </SubmenuItem>
          ))}
        </Submenu>
      )}
    </DropdownWrapper>
  );
};