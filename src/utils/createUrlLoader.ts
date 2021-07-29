import { Url } from "../entities/Url";
import DataLoader from "dataloader";

export const createUpdootLoader = () =>
  new DataLoader<number, Url>(async (urlIds) => {
    const urls = await Url.findByIds(urlIds as any);
    const urlIdToUrl: Record<string, Url> = {};
    urls.forEach((url) => {
      urlIdToUrl[url.creatorId] = url;
    });

    const sortedUrls = urlIds.map((urlId) => urlIdToUrl[urlId]);
    return sortedUrls;
  });
