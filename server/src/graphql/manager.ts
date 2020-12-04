import { Bookmark } from '../entities/Bookmark'
import { Chapter } from '../entities/Chapter'
import { User } from '../entities/User'
import { Work } from '../entities/Work'

export const allUsers = async() => {
  return await User.find();
};

export const worksOfUser = async (userID: number) => {
  const user = await User.findOne({
    where: { id: userID },
    relations: ['works']
  });
  return user?.works;
}

export const bookmarksOfUser = async (userID: number) => {
  const user = await User.findOne({
    where: { id: userID },
    relations: ['bookmarks']
  });
  return user?.bookmarks;
}

export const allWorks = async() => {
  return await Work.find();
};

export const chaptersOfWork = async (workID: number) => {
  const work = await Work.findOne({
    where: { id: workID },
    relations: ['chapters']
  });
  return work?.chapters;
}