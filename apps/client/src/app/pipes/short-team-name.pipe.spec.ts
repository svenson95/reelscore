import { ShortTeamNamePipe } from './short-team-name.pipe';

describe('ShortTeamNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ShortTeamNamePipe();
    expect(pipe).toBeTruthy();
  });
});
