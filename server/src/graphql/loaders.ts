import DataLoader from 'dataloader';
import { Bookmark } from '../entities/Bookmark';
import { Chapter } from '../entities/Chapter';
import { User } from '../entities/User';
import { Work } from '../entities/Work';

// aux function that will format the result to be ordered by the given ids,
// otherwise dataloader throws an error

export const workLoader = () => new DataLoader(async (ids: readonly number[]) => {
  const works = await Work.findByIds(<number[]>ids, { relations: ['user'] });
  const workMap: { [key: number]: Work } = {};
  works.forEach(work => {
    workMap[work.id] = work;
  });
  return ids.map(id => workMap[id]);
});

export const userLoader = () => new DataLoader(async (ids: readonly number[]) => {
  const users = await User.findByIds(<number[]>ids);
  const userMap: { [key: number]: User } = {};
  users.forEach(user => {
    userMap[user.id] = user;
  });
  return ids.map(id => userMap[id]);
});

export const bookmarkLoader = () => new DataLoader(async (ids: readonly number[]) => {
  const bookmarks = await Bookmark.findByIds(<number[]>ids, { relations: ['user', 'work'] });
  const bookmarkMap: { [key: number]: Bookmark } = {};
  bookmarks.forEach(bookmark => {
    bookmarkMap[bookmark.id] = bookmark;
  });
  return ids.map(id => bookmarkMap[id]);
});

export const chapterLoader = () => new DataLoader(async (ids: readonly number[]) => {
  const chapters = await Chapter.findByIds(<number[]>ids);
  const chapterMap: { [key: number]: Chapter } = {};
  chapters.forEach(chapter => {
    chapterMap[chapter.id] = chapter;
  });
  return ids.map(id => chapterMap[id]);
});




