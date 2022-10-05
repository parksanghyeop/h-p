import React, { useState, useEffect, useMemo } from 'react'
import ReviewProgress from './ReviewProgress'
import styled from 'styled-components'
import { Rating } from '@mui/material'
import useFetchData from "../../hooks/useFetchData";
import useIntersect from "../../hooks/useIntersect";
import { createReviewFetch, PillDetailFetch, updateReviewFetch } from '../../store/actions/pills'
import { useDispatch } from 'react-redux'
import CancelModal from './CancelModal.js'
import ReviewBox from './ReviewBox'
import { fetchPillMyReview, fetchPillReview } from '../../store/actions/pills'
const Container = styled.div`
box-sizing: border-box;
margin: 8px 16px;

background: #FFFFFF;
border: 1px solid #CAD1D5;
border-radius: 8px;
`
const ProFlexBox = styled.div`
display: flex;
margin: 8px;
justify-content: center;
;
`
const TextDiv = styled.div`
min-width: 24px;
font-size: 12px;
text-align: center;
margin: 0px 4px;
font-weight: bold;
`
const NumDiv = styled.div`
font-size: 12px;
text-align: center;
margin: 0px 4px;
font-weight: bold;
`
const LinearStar = styled.i`
font-weight: 900;
font-size: 20px;
/* identical to box height */
line-height: 28px;
margin: 4px 8px;

background: linear-gradient(180deg, #6A53FE 0%, #537CFE 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
`
const ReviewBtn = styled.button`
display: block;
font-family: 'GmarketSans';
background: #537CFE;
border-radius: 8px;
color: #fff;
font-size: 15px;
padding: 4px 60px;
margin: 8px
`
const GradientIcon = styled.i`
background: linear-gradient(180deg, #6A53FE 0%, #537CFE 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
`
const BtnDiv = styled.div`
// background: linear-gradient(to right, #537CFE 0%, #6A53FE 100%);
font-size: 12px;
text-align: center;
border: 1.1px solid #537CFE;
border-radius: 8px;
padding: 6px 10px;
margin: 8px 6px;
cursor: pointer;
color: #537CFE;
`
const BtnDivCancel = styled.div`
font-size: 12px;
text-align: center;
border: 1px solid #e0e0e0;
border-radius: 8px;
padding: 6px 10px;
margin: 8px 6px;
cursor: pointer;
`
const ReviewContainer = styled.div`
box-sizing: border-box;
margin: 8px 16px;

background: #FFFFFF;
border: 1px solid #CAD1D5;
border-radius: 8px;
`
const Target = styled.div`
  height: 1px;
`;
const PillReview = ({ id, pillReviewAverage, pillReviewCount, reviews, scores }) => {
  const dispatch = useDispatch()
  const { res } = useFetchData(
    fetchPillReview,
    "searchPill",
    () => { },
    () => { },
    id
  );
  const reviewList = useMemo(
    () =>
      res.data
        ? res.data.pages.flatMap((item) => {
          return item.data.content;
        })
        : [],
    [res.data]
  );
  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (res.hasNextPage && !res.isFetching) {
      res.fetchNextPage();
    }
  });

  const starRating = {
    fiveRating: scores[5],
    fourRating: scores[4],
    threeRating: scores[3],
    twoRating: scores[2],
    oneRating: scores[1]
  }

  const fiveRating = (starRating.fiveRating / pillReviewCount) * 100 + '%'
  const fourRating = (starRating.fourRating / pillReviewCount) * 100 + '%'
  const threeRating = (starRating.threeRating / pillReviewCount) * 100 + '%'
  const twoRating = (starRating.twoRating / pillReviewCount) * 100 + '%'
  const oneRating = (starRating.oneRating / pillReviewCount) * 100 + '%'

  const [score, setScore] = useState(3)
  const [isOpened, setIsOpened] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [text, setText] = useState('')
  const [reviewId, setReviewId] = useState(0)
  const [myReview, setMyReview] = useState(null)

  useEffect(() => {
    fetchPillMyReview(id)
      .then((res) => {
        setMyReview(res.data)
      })
  }, [id])
  console.log(myReview, reviewList)
  const createReviewHandler = () => {
    const review = {
      score: score,
      content: text,
      pillID: id,
    }
    setIsOpened(!isOpened)
    dispatch(createReviewFetch(review))
      .then(() => {
        dispatch(PillDetailFetch(id))
      })
  }

  const updateReviewHandler = (reviewId) => {
    const review = {
      score: score,
      content: text,
      reviewId: reviewId,
    }
    setUpdating(!updating)
    dispatch(updateReviewFetch(review))
      .then(() => {
        dispatch(PillDetailFetch(id))
      })
  }

  const cancelHandler = () => {
    setScore(3)
    setIsOpened(!isOpened)
    setText('')
  }

  const updatingHandler = (reviewId, reviewScore, reviewContent) => {
    setScore(reviewScore)
    setText(reviewContent)
    setReviewId(reviewId)
    setUpdating(!updating)
  }


  const textHandler = (e) => {
    setText(e.target.value)
  }

  const [modalOpen, setModalOpen] = useState(false);

  const showModal = (reviewId) => {
    setModalOpen(true);
    setReviewId(reviewId)
  };

  let reviewaverage = ''
  if (pillReviewAverage) {
    reviewaverage = pillReviewAverage.toFixed(1)
  }

  return (
    <>
      <Container>
        {pillReviewCount === 0
          ? <div style={{ borderBottom: '1px solid #CAD1D5', textAlign: 'center' }}>
            <GradientIcon style={{ marginTop: '32px' }} className="fa-regular fa-message-dots fa-2x"></GradientIcon>
            <div style={{ marginBottom: '32px', marginTop: '16px' }}>
              아직 작성된 리뷰가 없네요!
            </div>
          </div>
          : <div style={{ display: 'flex', borderBottom: '1px solid #CAD1D5' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '16px', width: '30%' }}>
              <div style={{ fontSize: '14px', textAlign: 'center', paddingTop: '20px', minWidth: '92px' }}>
                사용자 총 평점
              </div>
              <ProFlexBox>
                <LinearStar className="fas fa-star"></LinearStar>
                <div style={{ fontSize: '24px', lineHeight: '40px' }}>
                  {reviewaverage}
                  <p style={{ fontSize: '12px', display: 'inline' }}>({pillReviewCount})</p>
                </div>
              </ProFlexBox>
            </div>
            <div style={{ margin: '8px 8px', width: '90%' }}>
              <ProFlexBox>
                <TextDiv>
                  최고
                </TextDiv>
                <ReviewProgress width={fiveRating} />
                <NumDiv>
                  {starRating.fiveRating}
                </NumDiv>
              </ProFlexBox>
              <ProFlexBox>
                <TextDiv>
                  좋음
                </TextDiv>
                <ReviewProgress width={fourRating} />
                <NumDiv>
                  {starRating.fourRating}
                </NumDiv>
              </ProFlexBox>
              <ProFlexBox>
                <TextDiv>
                  보통
                </TextDiv>
                <ReviewProgress width={threeRating} />
                <NumDiv>
                  {starRating.threeRating}
                </NumDiv>
              </ProFlexBox>
              <ProFlexBox>
                <TextDiv>
                  별로
                </TextDiv>
                <ReviewProgress width={twoRating} />
                <NumDiv>
                  {starRating.twoRating}
                </NumDiv>
              </ProFlexBox>
              <ProFlexBox>
                <TextDiv>
                  최악
                </TextDiv>
                <ReviewProgress width={oneRating} />
                <NumDiv>
                  {starRating.oneRating}
                </NumDiv>
              </ProFlexBox>
            </div>
          </div>}
        {!myReview &&
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginTop: '8px' }}>
              당신의 경험을 공유해 주세요!
            </div>
            <div>
              <ReviewBtn onClick={cancelHandler}>리뷰 작성하기</ReviewBtn>
            </div>
          </div>
        }
      </Container>
      {
        isOpened ?
          <ReviewBox
            createReviewHandler={createReviewHandler}
            cancelHandler={cancelHandler}
            setScore={setScore}
            textHandler={textHandler}
            score={score}
            text={text} />
          : <></>
      }
      {myReview ?
        <div>
          {!updating ?
            <ReviewContainer>
              {modalOpen && <CancelModal setModalOpen={setModalOpen} reviewId={reviewId} pillID={id} />}
              <div style={{ padding: '12px 12px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginTop: '2px' }}>
                  {myReview.nickName.substr(0, 1) + '*'.repeat(myReview.nickName.length - 2) + myReview.nickName.substr(-1)}
                </div>
                <div style={{ display: 'flex' }}>
                  <BtnDiv onClick={() => { updatingHandler(myReview.reviewId, myReview.reviewScore, myReview.reviewContent) }} style={{ paddingRight: '24px', margin: '0 0' }}>
                    수정
                  </BtnDiv>
                  <BtnDiv
                    onClick={() => { showModal(myReview.reviewId) }}
                    style={{ margin: '0 0' }}>
                    삭제
                  </BtnDiv>
                </div>
              </div>
              <div style={{ borderBottom: '1px solid #CAD1D5' }}>
                <Rating
                  style={{ padding: '0px 10px 6px' }}
                  name="simple-controlled"
                  readOnly
                  value={myReview.reviewScore}
                  size="small"
                  icon={<GradientIcon className="fas fa-star"></GradientIcon>}
                  emptyIcon={<i className="fa-thin fa-star"></i>}
                />
              </div>
              <div style={{ margin: '12px 12px' }}>
                {myReview.reviewContent}
              </div>
            </ReviewContainer>
            : <ReviewBox
              key={myReview.reviewId}
              reviewId={myReview.reviewId}
              updatingHandler={updatingHandler}
              updateReviewHandler={updateReviewHandler}
              defaultScore={myReview.reviewScore}
              defaultText={myReview.reviewContent}
              setScore={setScore}
              textHandler={textHandler} />
          }
        </div>
        : <></>}
      {
        pillReviewCount !== 0 ? reviewList.map(review => {
          return (
            <ReviewContainer key={review.reviewId}>
              <div style={{ padding: '12px 12px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginTop: '2px' }}>
                  {review.nickName.substr(0, 1) + '*'.repeat(review.nickName.length - 2) + review.nickName.substr(-1)}
                </div>
              </div>
              <div style={{ borderBottom: '1px solid #CAD1D5' }}>
                <Rating
                  style={{ padding: '0px 10px 6px' }}
                  name="simple-controlled"
                  readOnly
                  value={review.reviewScore}
                  size="small"
                  icon={<GradientIcon className="fas fa-star"></GradientIcon>}
                  emptyIcon={<i className="fa-thin fa-star"></i>}
                />
              </div>
              <div style={{ margin: '12px 12px' }}>
                {review.reviewContent}
              </div>
            </ReviewContainer>)
        }) : <></>}
      <Target ref={ref} />
    </>
  )
}

export default PillReview