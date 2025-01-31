import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler } from 'react';
import { useCallback, memo } from 'react';

import { useDidMount } from '../../hooks/useDidMount';
import type { DisplayPreferences } from '../../hooks/useDisplayPreferences';
import { useDisplayPreferences } from '../../hooks/useDisplayPreferences';
import type { HomePageProps } from '../../pages/[displayStyle]/[cursor]';
import { Button } from '../Button/Button';
import { DisplayStyleSwitch } from '../DisplayStyleSwitch/DisplayStyleSwitch';

import { BlogsGrid } from './BlogsGrid';
import { BlogsList } from './BlogsList';
import styles from './mainTiles.module.scss';

type MainTilesProps = HomePageProps;

export const MainTiles = memo<MainTilesProps>((props) => {
  const router = useRouter();
  const [changeDisplay] = useDisplayPreferences();

  const changeDisplayStyle = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget }) => {
      changeDisplay(currentTarget.value as DisplayPreferences);
    },
    [changeDisplay],
  );

  useDidMount(() => {
    void router.prefetch(`/grid`);
    void router.prefetch(`/list`);
  });

  return (
    <>
      <h2 className={styles.heading}>Wszystkie artykuły</h2>
      <div className={styles.buttons}>
        <Link href="/zglos-serwis" passHref>
          <Button as="a" icon="icon-plus">
            Zgłoś serwis
          </Button>
        </Link>
        <DisplayStyleSwitch value={props.displayStyle} onChange={changeDisplayStyle} />
      </div>
      {props.displayStyle === 'list' ? (
        <BlogsList articles={props.articles} />
      ) : (
        <BlogsGrid blogs={props.blogs} />
      )}
      <div className={styles.pagination}>
        {props.nextCursor && (
          <Link passHref href={`/${props.displayStyle}/${props.nextCursor}`}>
            <Button
              className={styles.nextPageButton}
              as="a"
              iconPosition="right"
              icon="icon-arrow-right2"
            >
              Następna strona
            </Button>
          </Link>
        )}
      </div>
    </>
  );
});

MainTiles.displayName = 'MainTiles';
