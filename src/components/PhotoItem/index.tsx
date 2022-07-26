import { FC, useCallback, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Card, Image, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';

import { IPhoto } from '../../types/photo';
import { useUser } from '../../contexts/UserContext';

interface PhotoItemProps {
  photo: IPhoto;
  updatePhoto: (old: IPhoto, updated: IPhoto) => void;
}

const PhotoItem: FC<PhotoItemProps> = ({ photo, updatePhoto }) => {
  const [isLikePending, setIsLikePending] = useState(false);
  const { tokens } = useUser();

  const unlikeAndLike = useCallback(
    async (type: 'like' | 'unlike') => {
      setIsLikePending(true);
      try {
        const data = await fetch(
          `${process.env.REACT_APP_UNSPLASH_BASE_URL}/photos/${photo.id}/like`,
          {
            method: (type === 'unlike' && 'delete') || 'post',
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          },
        )
          .then((r) => (r.ok && r) || Promise.reject(r))
          .then((r) => r.json());
        updatePhoto(photo, data.photo);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        setIsLikePending(false);
      }
    },
    [photo, tokens, updatePhoto],
  );
  return (
    <Card
      hoverable
      cover={
        <Image
          alt={photo.alt_description}
          src={photo.urls.small}
          preview={{
            src: photo.urls.regular,
          }}
        />
      }
      actions={[
        (photo.liked_by_user && (
          <HeartFilled
            key="love"
            onClick={() => isLikePending || unlikeAndLike('unlike')}
          />
        )) || (
          <HeartOutlined
            key="love"
            onClick={() => isLikePending || unlikeAndLike('like')}
          />
        ),
      ]}
      className="PhotoItem"
    >
      <Meta
        description={<Typography.Text>{photo.description}</Typography.Text>}
      />
    </Card>
  );
};

export default PhotoItem;
