import styled from 'styled-components';
import Content from './Content';
import { useNavigate } from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { PlaylistInfoType } from '../../pages/PlaylistList';

type MypageContentsType = {
	title?: string;
	contents?: Array<PlaylistInfoType>;
	key?: number;
};

const MypageContents = ({ title, contents }: MypageContentsType) => {
	const navigate = useNavigate();
	const slidesPerView = contents.length < 3 ? contents.length : 3;
	return (
		<MypageContentsStyle>
			<Roof>
				<div>{title}</div>
				{title === '나의 플레이리스트' ? (
					<div>
						<button onClick={() => navigate('/makeplaylist/create')}>
							플리 만들기
						</button>
						<button onClick={() => navigate('/playlistcollection')}>
							더보기
						</button>
					</div>
				) : (
					<button onClick={() => navigate('/playlistcollection')}>
						더보기
					</button>
				)}
			</Roof>
			<Body>
				<Swiper
					modules={[Pagination, Navigation]}
					slidesPerView={slidesPerView}
					navigation
					pagination={{ clickable: true }}>
					{contents.map((playlist) => {
						return (
							<SwiperSlide key={playlist.playlistId}>
								<Content playlist={playlist} />
							</SwiperSlide>
						);
					})}
				</Swiper>
			</Body>
		</MypageContentsStyle>
	);
};

export default MypageContents;

const MypageContentsStyle = styled.div`
	box-shadow: 1px 1px 10px #4d0bd133;
`;
const Roof = styled.div`
	padding: 10px 20px;
	margin-top: 60px;
	border-top-left-radius: ${(props) => props.theme.radius.largeRadius};
	border-top-right-radius: ${(props) => props.theme.radius.largeRadius};
	background-color: ${(props) => props.theme.colors.purple};
	color: ${(props) => props.theme.colors.white};
	display: flex;
	justify-content: space-between;
	align-items: center;

	button {
		padding: 3px 7px;
		margin-left: 12px;
		background-color: ${(props) => props.theme.colors.white};
		color: ${(props) => props.theme.colors.purple};
		border-radius: ${(props) => props.theme.radius.smallRadius};
		transition: 0.1s;

		:hover {
			background-color: #e8ddff;
		}

		// Tablet, Mobile
		@media screen and (max-width: 980px) {
			font-size: 14px;
		}
	}
`;

const Body = styled.div`
	margin-bottom: 60px;
	border-bottom-left-radius: ${(props) => props.theme.radius.largeRadius};
	border-bottom-right-radius: ${(props) => props.theme.radius.largeRadius};
	background-color: ${(props) => props.theme.colors.white};
	display: flex;
	overflow-x: auto;
	overflow-y: hidden;
	padding: 5% 10%;
`;
