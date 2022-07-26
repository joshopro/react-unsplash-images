import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Col, Input, Row, Space, Spin, Typography } from 'antd';
import PhotoItem from '../PhotoItem';
import { SearchOutlined } from '@ant-design/icons';

import { useUser } from '../../contexts/UserContext';
import { IPhoto } from '../../types/photo';

interface PhotosProps {}

const Photos: FC<PhotosProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { tokens } = useUser();
  const [query, setQuery] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const [photos, setPhotos] = useState<Array<IPhoto[]>>([]);
  const keys = [1, 2, 3, 4];

  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      if (!query) return;
      setIsLoading(true);
      fetch(
        `${process.env.REACT_APP_UNSPLASH_BASE_URL}/search/photos?query=${query}&per_page=16`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      )
        .then((r) => {
          if (!r.ok) {
            return Promise.reject(r);
          }
          return r.json();
        })
        .then((data) => {
          const photosTwoDimension: Array<IPhoto[]> = [[], [], [], []];
          data.results.forEach((photo: IPhoto, i: number) => {
            photosTwoDimension[i % 4].push(photo);
          });
          setPhotos(photosTwoDimension);
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, tokens]);

  const updatePhoto = useCallback(
    (parentIndex: number) => (old: IPhoto, updated: IPhoto) => {
      const index = photos[parentIndex]?.indexOf(old as any);
      if (index ?? index !== -1) {
        const tmpPhotos = [...photos];
        tmpPhotos[parentIndex][index] = updated;
        setPhotos(tmpPhotos);
      }
    },
    [photos],
  );
  return (
    <div className="Container">
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Input
          placeholder="Basic usage"
          prefix={<SearchOutlined />}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <div className="status-content-container">
            <Spin />
          </div>
        )}
        {isError && (
          <div className="status-content-container">
            <Typography.Text type="danger">
              Error on fetching photos
            </Typography.Text>
          </div>
        )}
        <Row gutter={[16, 16]}>
          {photos.map((photoArr, i: number) => (
            <Col key={keys[i]} xs={24} sm={12} md={8} lg={6}>
              <Space direction="vertical" style={{ display: 'flex' }}>
                {photoArr.map((photo) => (
                  <PhotoItem
                    photo={photo}
                    key={photo.id}
                    updatePhoto={updatePhoto(i)}
                  />
                ))}
              </Space>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
};

export default Photos;
