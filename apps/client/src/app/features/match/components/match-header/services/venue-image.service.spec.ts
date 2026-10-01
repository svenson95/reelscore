import { TestBed } from '@angular/core/testing';

import { ALLIANZ_ARENA_ID, VenueImageService } from './venue-image.service';

describe('VenueImageService', () => {
  let venueImageService: VenueImageService;
  let fetchVenueImageMock: jest.Mock;
  let createdImages: HTMLImageElement[];
  let createObjectUrlMock: jest.Mock;
  let revokeObjectUrlMock: jest.Mock;

  const originalFetch = globalThis.fetch;
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;

  const createImageResponse = (isSuccessful = true) => ({
    ok: isSuccessful,
    blob: async () => new Blob(['image']),
  });

  const flushImageLoading = async () => {
    TestBed.tick();

    // Fetch and blob conversion resolve asynchronously before the image load event.
    await jest.advanceTimersByTimeAsync(0);
  };

  const completeLatestImageLoad = (hasValidDimensions = true) => {
    const latestImage = createdImages[createdImages.length - 1];
    const imageWidth = hasValidDimensions ? 400 : 200;

    Object.defineProperty(latestImage, 'naturalWidth', { value: imageWidth });
    Object.defineProperty(latestImage, 'naturalHeight', { value: 400 });

    latestImage.onload?.(new Event('load'));
  };

  beforeEach(() => {
    jest.useFakeTimers();
    createdImages = [];

    fetchVenueImageMock = jest.fn().mockResolvedValue(createImageResponse());
    createObjectUrlMock = jest
      .fn()
      .mockImplementation(() => `blob:venue-${createdImages.length}`);
    revokeObjectUrlMock = jest.fn();

    globalThis.fetch = fetchVenueImageMock;
    URL.createObjectURL = createObjectUrlMock;
    URL.revokeObjectURL = revokeObjectUrlMock;

    const OriginalImageConstructor = window.Image;

    jest.spyOn(window, 'Image').mockImplementation(() => {
      const venueImage = new OriginalImageConstructor();

      createdImages.push(venueImage);

      return venueImage;
    });

    TestBed.configureTestingModule({ providers: [VenueImageService] });
    venueImageService = TestBed.inject(VenueImageService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.restoreAllMocks();
    jest.useRealTimers();

    globalThis.fetch = originalFetch;
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
  });

  it('finishes without a request when no venue is selected', async () => {
    await flushImageLoading();

    expect(fetchVenueImageMock).not.toHaveBeenCalled();
    expect(venueImageService.venueBackgroundLoaded()).toBe(true);
    expect(venueImageService.venueBackgroundImage()).toBeUndefined();
  });

  it('loads a valid background and releases its object URL on replacement and destruction', async () => {
    venueImageService.setVenueId(123);
    await flushImageLoading();

    expect(fetchVenueImageMock).toHaveBeenCalledWith(
      expect.stringContaining('/123.png'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        referrerPolicy: 'no-referrer',
      })
    );
    expect(venueImageService.venueBackgroundLoaded()).toBe(false);

    completeLatestImageLoad();
    await flushImageLoading();

    expect(venueImageService.venueBackgroundImage()).toBe(
      'url("blob:venue-0")'
    );
    expect(venueImageService.hasValidVenueBackground()).toBe(true);

    venueImageService.setVenueId(456);
    await flushImageLoading();

    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:venue-0');

    completeLatestImageLoad();
    await flushImageLoading();
    TestBed.resetTestingModule();

    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:venue-1');
  });

  it('rejects placeholder dimensions and loads the fallback venue', async () => {
    venueImageService.setVenueId(123);
    await flushImageLoading();

    completeLatestImageLoad(false);
    await flushImageLoading();

    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:venue-0');
    expect(fetchVenueImageMock).toHaveBeenLastCalledWith(
      expect.stringContaining(`/${ALLIANZ_ARENA_ID}.png`),
      expect.anything()
    );

    completeLatestImageLoad();
    await flushImageLoading();

    expect(venueImageService.venueBackgroundLoaded()).toBe(true);
    expect(venueImageService.hasValidVenueBackground()).toBe(true);
  });

  it('finishes without a background if the venue and fallback requests fail', async () => {
    fetchVenueImageMock.mockResolvedValue(createImageResponse(false));

    venueImageService.setVenueId(123);
    await flushImageLoading();

    expect(fetchVenueImageMock).toHaveBeenCalledTimes(2);
    expect(venueImageService.venueBackgroundLoaded()).toBe(true);
    expect(venueImageService.hasValidVenueBackground()).toBe(false);
    expect(venueImageService.venueBackgroundImage()).toBeUndefined();
  });

  it('aborts obsolete image validation, releases the URL and does not load a stale fallback', async () => {
    venueImageService.setVenueId(123);
    await flushImageLoading();

    const requestOptions: RequestInit = fetchVenueImageMock.mock.calls[0][1];
    const abortSignal = requestOptions.signal;
    const obsoleteImage = createdImages[0];

    venueImageService.setVenueId(null);
    await flushImageLoading();

    expect(abortSignal?.aborted).toBe(true);
    expect(obsoleteImage.onload).toBeNull();
    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:venue-0');
    expect(fetchVenueImageMock).toHaveBeenCalledTimes(1);
    expect(venueImageService.venueBackgroundImage()).toBeUndefined();
    expect(venueImageService.venueBackgroundLoaded()).toBe(true);
  });

  it('ignores a late response from an aborted request without creating an object URL', async () => {
    let resolvePendingResponse:
      | ((imageResponse: ReturnType<typeof createImageResponse>) => void)
      | undefined;

    const pendingResponse = new Promise<ReturnType<typeof createImageResponse>>(
      (resolve) => {
        resolvePendingResponse = resolve;
      }
    );

    fetchVenueImageMock.mockReturnValueOnce(pendingResponse);

    venueImageService.setVenueId(123);
    await flushImageLoading();
    venueImageService.setVenueId(null);
    await flushImageLoading();

    expect(resolvePendingResponse).toBeDefined();

    resolvePendingResponse?.(createImageResponse());
    await flushImageLoading();

    expect(createObjectUrlMock).not.toHaveBeenCalled();
    expect(fetchVenueImageMock).toHaveBeenCalledTimes(1);
    expect(venueImageService.venueBackgroundImage()).toBeUndefined();
  });

  it('recovers from image decoding errors with a valid fallback', async () => {
    venueImageService.setVenueId(123);
    await flushImageLoading();

    createdImages[0].onerror?.(new Event('error'));
    await flushImageLoading();

    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:venue-0');

    completeLatestImageLoad();
    await flushImageLoading();

    expect(venueImageService.hasValidVenueBackground()).toBe(true);
  });

  it('cleans up pending validation when the owning view is destroyed', async () => {
    venueImageService.setVenueId(123);
    await flushImageLoading();

    const requestOptions: RequestInit = fetchVenueImageMock.mock.calls[0][1];
    const abortSignal = requestOptions.signal;

    TestBed.resetTestingModule();
    await jest.advanceTimersByTimeAsync(0);

    expect(abortSignal?.aborted).toBe(true);
    expect(revokeObjectUrlMock).toHaveBeenCalledWith('blob:venue-0');
    expect(fetchVenueImageMock).toHaveBeenCalledTimes(1);
  });
});
