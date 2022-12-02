import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { PlaylistInfoType } from '../../pages/PlaylistList';
import { MyInitialStateValue } from '../../slices/mySlice';
import { Img, LinkRoom, RoomStyle, Thumbnail } from '../home/Room';

type ContentType = {
	id: number;
	playlist?: PlaylistInfoType;
	followlist?: any;
	userInfo?: MyInitialStateValue;
};

const Content = ({ id, playlist, followlist, userInfo }: ContentType) => {
	return (
		<>
			{id === 3 ? (
				<RoomStyle>
					<Link to={`/mypage/${followlist.memberId}`}>
						<LinkRoom>
							<FollowThumbnail>
								<FollowImg src={followlist.picture} alt="프로필" />
							</FollowThumbnail>
							<Name>{followlist.name}</Name>
							<Detail>
								{followlist.content || '등록된 자기소개가 없습니다.'}
							</Detail>
						</LinkRoom>
					</Link>
				</RoomStyle>
			) : (
				<RoomStyle>
					<Link to={`/playlistdetail/${playlist.playlistId}`}>
						<LinkRoom>
							<Thumbnail>
								<Img src={playlist.playlistItems[0].thumbnail} alt="썸네일" />
							</Thumbnail>
							<Name>{playlist.title}</Name>
							<Detail>{userInfo.name || playlist.name}</Detail>
						</LinkRoom>
					</Link>
				</RoomStyle>
			)}
		</>
	);
};

export default Content;

const FollowThumbnail = styled(Thumbnail)`
	display: flex;
	justify-content: center;
`;

const FollowImg = styled(Img)`
	width: 80%;
	max-width: 200px;
	border-radius: 50%;

	// Tablet, Mobile
	@media screen and (max-width: 980px) {
		max-width: 180px;
	}
`;

const Name = styled.div`
	text-align: center;
	margin-bottom: 10px;

	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	word-wrap: break-word;
	word-break: break-all;

	// Mobile
	@media screen and (max-width: 640px) {
		font-size: 14px;
	}
`;

export const Detail = styled.div`
	color: ${(props) => props.theme.colors.gray500};
	font-size: 14px;
	text-align: center;

	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	word-wrap: break-word;
	word-break: break-all;

	// Mobile
	@media screen and (max-width: 640px) {
		font-size: 12px;
	}
`;
