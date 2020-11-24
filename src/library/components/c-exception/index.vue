<template>
  <div
    class="c-exception"
    :class="wrapperCls"
  >
    <div class="c-exception-image">
      <slot name="icon">
        <img :src="svgIcon">
      </slot>
    </div>
    <div class="c-exception-content">
      <p
        v-if="title"
        class="title"
      >
        {{ title }}
      </p>
      <p
        v-if="subTitle"
        class="sub-title"
      >
        {{ subTitle }}
      </p>
      <div
        v-if="$slots.operation"
        class="operation"
      >
        <slot name="operation" />
      </div>
    </div>
  </div>
</template>

<script>
import svgNoContent from './assets/no-content.svg'
import svgNoMessage from './assets/no-message.svg'
import svg401 from './assets/401.svg'
import svg404 from './assets/404.svg'
import svg500 from './assets/500.svg'

const exceptionMapper = {
  'noContent': svgNoContent,
  'noMessage': svgNoMessage,
  '401': svg401,
  '404': svg404,
  '500': svg500
}

export default {
  name: 'CException',
  props: {
    type: {
      type: String,
      default: 'noContent'
    },
    align: {
      type: String,
      // 水平: horizontal  垂直: vertical
      default: 'horizontal'
    },
    // eslint-disable-next-line vue/require-default-prop
    title: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    subTitle: {
      type: String
    }
  },
  computed: {
    svgIcon () {
      return exceptionMapper[this.type]
    },
    wrapperCls () {
      return this.align
    }
  }
}
</script>

<style lang="scss">
.c-exception {
  display: flex;
  height: 100%;

  &.horizontal {
    flex-direction: row !important;
    align-items: center;
    justify-content: center;

    .c-exception-content {
      margin-left: 24px;
    }
  }

  &.vertical {
    flex-direction: column !important;
    justify-content: center;
    align-items: center;

    .c-exception-content {
      .title {
        text-align: center;
      }

      .operation {
        justify-content: center;
      }
    }
  }
}

.c-exception-content {
  .title {
    margin-bottom: 8px;
    font-size: 20px;
    font-weight: bold;
  }

  .sub-title {
    max-width: 400px;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: #63686A;
    word-wrap: break-word;
    text-align: left;
  }

  .operation {
    display: flex;
  }
}

.c-exception-image {
  display: flex;
  align-items: center;
  width: 200px;
  height: 200px;

  & > img {
    width: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
