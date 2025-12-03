import React from 'react'
import HighlightText from './HighlightText'
import know_yr_prog from '../../../assets/Images/Know_your_progress.png'
import compare_with_others from '../../../assets/Images/Compare_with_others.png'
import plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div className='mt-25 mb-10 lg:mb-1'>

        <div className='flex flex-col gap-5'>

            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for <HighlightText text={"learning any language"} />
            </div>

            <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex flex-row flex-wrap items-center justify-center'>
                <img src={know_yr_prog} 
                    alt="img"
                    className='object-contain lg:-mr-30'    
                />
                <img src={compare_with_others} 
                    alt="img"
                    className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'    
                />
                <img src={know_yr_prog} 
                    alt="img"
                    className='object-contain lg:-ml-28 lg:-mt-5 -mt-16'    
                />
            </div>

            <div className="w-fit mx-auto lg:mb-17 mt-8">
                <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
                </CTAButton>
            </div>

        </div>

    </div>
  )
}

export default LearningLanguageSection