import * as ImageManipulator from 'expo-image-manipulator';
import { prepareImages } from './prepareImages';
import type { DiaryEventWithImage, EventType } from '@/types';

jest.mock('expo-image-manipulator', () => ({
  SaveFormat: { JPEG: 'jpeg' },
  manipulateAsync: jest.fn(),
}));

const manipulateAsync = ImageManipulator.manipulateAsync as jest.MockedFunction<
  typeof ImageManipulator.manipulateAsync
>;

let nextId = 1;

function makeEvent(type: EventType, image_path: string | null): DiaryEventWithImage {
  return {
    id: nextId++,
    type,
    timestamp: 0,
    notes: null,
    severity: null,
    bristol_type: null,
    name: null,
    breaks_fast: 1,
    created_at: 0,
    image_path,
  };
}

function manipulationResult(base64?: string) {
  return { base64 } as Awaited<ReturnType<typeof ImageManipulator.manipulateAsync>>;
}

describe('prepareImages', () => {
  beforeEach(() => {
    manipulateAsync.mockReset();
  });

  it('skips events without an image path', async () => {
    const plain = makeEvent('food', null);
    const withImage = makeEvent('food', '/img/a.jpg');
    manipulateAsync.mockResolvedValue(manipulationResult('QUJD'));

    const result = await prepareImages([plain, withImage]);

    expect(Object.keys(result)).toEqual([String(withImage.id)]);
    expect(manipulateAsync).toHaveBeenCalledTimes(1);
    expect(manipulateAsync).toHaveBeenCalledWith(
      '/img/a.jpg',
      [{ resize: { width: 480 } }],
      expect.objectContaining({ base64: true }),
    );
  });

  it('maps event ids to base64 data URIs', async () => {
    const event = makeEvent('food', '/img/a.jpg');
    manipulateAsync.mockResolvedValue(manipulationResult('QUJD'));

    const result = await prepareImages([event]);

    expect(result[event.id]).toBe('data:image/jpeg;base64,QUJD');
  });

  it('silently skips unreadable images and keeps the rest of the export', async () => {
    const broken = makeEvent('food', '/img/broken.jpg');
    const fine = makeEvent('food', '/img/fine.jpg');
    manipulateAsync.mockImplementation(async (uri: string) => {
      if (uri === broken.image_path) throw new Error('file not found');
      return manipulationResult('RklORQ==');
    });

    const result = await prepareImages([broken, fine]);

    expect(result[broken.id]).toBeUndefined();
    expect(result[fine.id]).toBe('data:image/jpeg;base64,RklORQ==');
  });

  it('skips results without base64 data', async () => {
    const event = makeEvent('food', '/img/a.jpg');
    manipulateAsync.mockResolvedValue(manipulationResult(undefined));

    const result = await prepareImages([event]);

    expect(result).toEqual({});
  });
});
