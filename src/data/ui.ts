import {IDataset, PRELOADED_TYPE} from './IDataset';
import {toast} from 'materialize-css';
import {deleteDataset} from './db';
import {areyousure} from '../ui';

function sessions(d: IDataset, card: HTMLElement) {
  // if (!d.sessions) {
  //   return;
  // }

  const content = card.querySelector<HTMLElement>('.card-reveal')!;
  content.insertAdjacentHTML('beforeend', `
  <div class="card-sessions">
    <span class="card-title grey-text text-darken-4">Saved Sessions
      <i class="material-icons right">close</i>
    </span>
    <ul class="collection">
      <li class="collection-item">
        <div>
        <span class="title">NAME</span>
        <p>DATE</p>
        <a href="#!" class="secondary-content"><i class="material-icons">play_arrow</i></a>
        <a href="#!" class="secondary-content"><i class="material-icons">delete</i></a>
        </div>
      </li>
    </ul>
  </div>`);
  content.querySelector<HTMLElement>('.card-sessions .card-title')!.onclick = () => {
    content.classList.remove('sessions');
  };

  const sessions = document.createElement('a');
  sessions.href = '#';
  sessions.classList.add('activator');
  sessions.innerHTML = `Sessions`;
  card.querySelector<HTMLElement>('.card-action')!.appendChild(sessions);
  sessions.onclick = async (evt) => {
    evt.preventDefault();
    content.classList.add('sessions'); // show sessions part
  };
}

export function createCard(d: IDataset, onDelete: () => void) {
  const card = document.createElement('div');

  card.classList.add('carousel-item', 'card', 'sticky-action');
  card.innerHTML = `<div class="card-image waves-effect waves-block waves-light sticky-action">
    ${d.image ? `<img class="activator" src="${d.image}" alt="No Preview Available">`: `<span class="material-icons grey-text local-image activator">photo</span>`}
  </div>
  <div class="card-content">
    <span class="card-title activator grey-text text-darken-4">${d.title}
      <i class="material-icons right">more_vert</i>
    </span>
  </div>
  <div class="card-action">
    <a href="#${d.id}">Select</a>
  </div>
  <div class="card-reveal">
    <div class="card-desc">
      <span class="card-title grey-text text-darken-4">${d.title}
        <i class="material-icons right">close</i>
      </span>
      ${d.description}
      ${d.link ? `<p><a href="${d.link}" target="_blank" rel="noopener">Kaggle Link</a></p>` : ''}
    </div>
  </div>`;
  sessions(d, <HTMLElement>card);

  if (d.type === PRELOADED_TYPE) {
    // no further actions
    return card;
  }

  card.querySelector<HTMLElement>('.card-image')!.innerHTML = `<span class="material-icons grey-text local-image activator">computer</span>`;

  const deleteButton = document.createElement('a');
  deleteButton.href = '#';
  deleteButton.innerHTML = `Delete`;
  card.querySelector<HTMLElement>('.card-action')!.appendChild(deleteButton);
  deleteButton.onclick = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    try {
      await areyousure(`to delete dataset "${d.title}"`);
      await deleteDataset(d);
      toast({html: `Dataset "${d.title}" deleted`, displayLength: 5000});
      onDelete();
    } catch (error) {
      toast({html: `Error while deleting dataset: <pre>${error}</pre>`, displayLength: 5000});
    }
  };

  return card;
}
