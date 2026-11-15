import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PlayerSettingsModal } from '@/features/player/components/PlayerSettingsModal';

describe('PlayerSettingsModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <PlayerSettingsModal
        open={false}
        nickname="ada"
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('saves the nickname', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<PlayerSettingsModal open nickname="ada" onClose={onClose} onSave={onSave} />);

    const input = screen.getByLabelText('Apodo');
    await user.clear(input);
    await user.type(input, 'grace');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSave).toHaveBeenCalledWith('grace');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes without saving', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<PlayerSettingsModal open nickname="ada" onClose={onClose} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
