import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { TopicsService } from 'services';
import { notificationUtils, toastUtils } from 'utils';
import MarkdownEditor from 'components/MarkdownEditor';
import { PostTab, PostTitle } from './components';
import styles from './Post.scss';

@withRouter
class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tab: 'dev',
      titleValue: '',
      contentValue: '',
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  onTabChange({ target: { value } }) {
    this.setState({
      tab: value,
    });
  }

  onTitleChange({ target: { value } }) {
    this.setState({
      titleValue: value,
    });
  }

  onEditorChange(value) {
    this.setState({
      contentValue: value,
    });
  }

  async onSubmitClick() {
    const { titleValue: title, tab, contentValue: content } = this.state;
    if (title.length === 0) {
      notificationUtils.error('请输入文章标题');
      return;
    }
    if (content.length === 0) {
      notificationUtils.error('请输入文章内容');
      return;
    }

    this.setState({
      loading: true,
    });
    try {
      const { data: { success, topic_id } } =
        await TopicsService.postTopics({ title, tab, content });
      this.setState({
        loading: false,
      });
      if (success) {
        toastUtils.success('发布成功');
        this.props.history.push(`/topic/${topic_id}`);
      } else {
        toastUtils.warning('服务器出小差了，请稍后再试');
      }
    } catch (e) {
      // 判断 postTopics 中断
      if (!(e instanceof TypeError)) {
        toastUtils.warning('网络出小差了，请稍后再试');
      }
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { loading, titleValue, contentValue } = this.state;
    return (
      <div className={styles.container}>
        <PostTab onTabChange={this.onTabChange} />
        <PostTitle
          value={titleValue}
          onTitleChange={this.onTitleChange}
        />
        <MarkdownEditor
          value={contentValue}
          onEditorChange={this.onEditorChange}
        />
        <Button
          type="primary"
          icon="share-alt"
          loading={loading}
          onClick={this.onSubmitClick}
        >
          发布主题
        </Button>
      </div>
    );
  }
}

Post.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default Post;