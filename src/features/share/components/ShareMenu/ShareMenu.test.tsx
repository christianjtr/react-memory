import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareMenu } from './ShareMenu';

const payload = {
  title: 'Github Memory',
  text: 'Saqué 1160 puntos',
  url: 'https://github.com/christianjtr/react-memory',
};

function renderMenu(props: Partial<Parameters<typeof ShareMenu>[0]> = {}) {
  return render(
    <ShareMenu
      payload={props.payload ?? payload}
      cardUrl={props.cardUrl ?? null}
      status={props.status ?? 'idle'}
      onShareTo={props.onShareTo ?? vi.fn()}
      onCopy={props.onCopy ?? vi.fn()}
      onDownload={props.onDownload ?? vi.fn()}
      onClose={props.onClose ?? vi.fn()}
    />,
  );
}

describe('ShareMenu', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists the social channels, copy and download options', () => {
    renderMenu({ cardUrl: 'blob:card' });

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /Compartir en Whatsapp/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /Compartir en Facebook/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Compartir en X/ })).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /Compartir en Telegram/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /Compartir en Linkedin/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Copiar enlace y texto' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Descargar tarjeta PNG' }),
    ).toBeInTheDocument();
  });

  it('opens the whatsapp intent on a new tab', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const onShareTo = vi.fn();

    renderMenu({ onShareTo });

    await user.click(screen.getByRole('menuitem', { name: /Compartir en Whatsapp/ }));

    expect(onShareTo).toHaveBeenCalledWith('whatsapp');
    expect(open).not.toHaveBeenCalled();
  });

  it('copies the link from the menu', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();

    renderMenu({ onCopy });

    await user.click(screen.getByRole('menuitem', { name: 'Copiar enlace y texto' }));

    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('downloads the card when the png is ready', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    renderMenu({ cardUrl: 'blob:card', onDownload });

    await user.click(screen.getByRole('menuitem', { name: 'Descargar tarjeta PNG' }));

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('disables the download until the card is rendered', () => {
    renderMenu();

    expect(
      screen.getByRole('menuitem', { name: 'Descargar tarjeta PNG' }),
    ).toBeDisabled();
  });

  it('marks the copy option after copying', () => {
    renderMenu({ status: 'copied' });

    expect(
      screen.getByRole('menuitem', { name: '¡Enlace copiado!' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '¡Enlace copiado!' })).toBeDisabled();
  });

  it('closes through the backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderMenu({ onClose });

    await user.click(
      screen.getByRole('button', { name: 'Cerrar opciones de compartir' }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
