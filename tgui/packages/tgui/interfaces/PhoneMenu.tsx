import { useLocalState } from '../backend';
import { useBackend } from 'tgui/backend';
import { Button, Input, Section, Stack, Tabs } from 'tgui-core/components';
import { Window } from 'tgui/layouts';

type Data = {
  availability: number;
  last_caller: string | null;
  available_transmitters: string[] | Record<string, unknown>;
  transmitters: {
    phone_category: string;
    phone_color: string;
    phone_id: string;
    phone_icon: string;
  }[];
};

export const PhoneMenu = () => {
  return (
    <Window width={500} height={400}>
      <Window.Content>
        <GeneralPanel />
      </Window.Content>
    </Window>
  );
};

const GeneralPanel = () => {
  const { act, data } = useBackend<Data>();
  const { availability, last_caller, available_transmitters, transmitters } = data;

  // Преобразуем available_transmitters в массив строк (ID доступных телефонов)
  let availableIds: string[] = [];
  if (Array.isArray(available_transmitters)) {
    availableIds = available_transmitters;
  } else if (available_transmitters && typeof available_transmitters === 'object') {
    availableIds = Object.keys(available_transmitters);
  }

  // Фильтруем телефоны, оставляя только доступные
  const availablePhones = transmitters.filter((phone) =>
    availableIds.includes(phone.phone_id)
  );

  // Собираем уникальные категории
  const categories: string[] = [];
  for (let i = 0; i < availablePhones.length; i++) {
    const phone = availablePhones[i];
    if (!categories.includes(phone.phone_category)) {
      categories.push(phone.phone_category);
    }
  }

  const [currentSearch, setSearch] = useLocalState('current_search', '');
  const [selectedPhone, setSelectedPhone] = useLocalState<string | null>(
    'selected_phone',
    null
  );
  const [currentCategory, setCategory] = useLocalState(
    'current_category',
    categories.length > 0 ? categories[0] : ''
  );

  let dnd_tooltip = 'Do Not Disturb is DISABLED';
  let dnd_locked = 'No';
  let dnd_icon = 'volume-high';
  if (availability === 1) {
    dnd_tooltip = 'Do Not Disturb is ENABLED';
    dnd_icon = 'volume-xmark';
  } else if (availability >= 2) {
    dnd_tooltip = 'Do Not Disturb is ENABLED (LOCKED)';
    dnd_locked = 'Yes';
    dnd_icon = 'volume-xmark';
  } else if (availability < 0) {
    dnd_tooltip = 'Do Not Disturb is DISABLED (LOCKED)';
    dnd_locked = 'Yes';
  }

  return (
    <Section fill>
      <Stack vertical fill>
        <Stack.Item>
          <Tabs>
            {categories.map((val) => (
              <Tabs.Tab
                selected={val === currentCategory}
                onClick={() => setCategory(val)}
                key={val}
              >
                {val}
              </Tabs.Tab>
            ))}
          </Tabs>
        </Stack.Item>
        <Stack.Item>
          <Input
            fluid
            value={currentSearch}
            placeholder="Search for a phone"
            onInput={(e, value) => setSearch(value.toLowerCase())}
          />
        </Stack.Item>
        <Stack.Item grow>
          <Section fill scrollable>
            <Tabs vertical>
              {availablePhones.map((phone) => {
                if (
                  phone.phone_category !== currentCategory ||
                  !phone.phone_id.toLowerCase().includes(currentSearch)
                ) {
                  return null;
                }
                return (
                  <Tabs.Tab
                    selected={selectedPhone === phone.phone_id}
                    onClick={() => {
                      if (selectedPhone === phone.phone_id) {
                        act('call_phone', { phone_ref: transmitter.phone_ref });
                      } else {
                        setSelectedPhone(phone.phone_id);
                      }
                    }}
                    key={phone.phone_id}
                    color={phone.phone_color}
                    onFocus={() => document.activeElement?.blur?.()}
                    icon={phone.phone_icon}
                  >
                    {phone.phone_id}
                  </Tabs.Tab>
                );
              })}
            </Tabs>
          </Section>
        </Stack.Item>
        {selectedPhone && (
          <Stack.Item>
            <Button
              color="good"
              fluid
              textAlign="center"
              onClick={() => act('call_phone', { phone_id: selectedPhone })}
            >
              Dial
            </Button>
          </Stack.Item>
        )}
        {last_caller && <Stack.Item>Last Caller: {last_caller}</Stack.Item>}
        <Stack.Item>
          <Button
            color="red"
            tooltip={dnd_tooltip}
            disabled={dnd_locked === 'Yes'}
            icon={dnd_icon}
            fluid
            textAlign="center"
            onClick={() => act('toggle_dnd')}
          >
            Do Not Disturb
          </Button>
        </Stack.Item>
      </Stack>
    </Section>
  );
};
