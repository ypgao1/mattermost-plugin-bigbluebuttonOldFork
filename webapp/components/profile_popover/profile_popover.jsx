const React = window.react;
import PropTypes from 'prop-types';
import {makeStyleFromTheme, changeOpacity} from 'mattermost-redux/utils/theme_utils';
import {Link} from 'react-router-dom'
import * as ChannelActions from 'mattermost-redux/actions/channels';

export default class ProfilePopover extends React.PureComponent {
  static propTypes = {

    src: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    cur_user: PropTypes.object.isRequired,
    teamname: PropTypes.string.isRequired,
    status: PropTypes.string,
    isBusy: PropTypes.bool,
    hide: PropTypes.func,
    isRHS: PropTypes.bool,
    theme: PropTypes.object.isRequired,
    positionLeft: PropTypes.number.isRequired,
    positionTop: PropTypes.number.isRequired,
    actions: PropTypes.shape({startMeeting: PropTypes.func.isRequired}).isRequired

  }

  static defaultProps = {
    isBusy: false,
    hide: () => {},
    isRHS: false
  }

  constructor(props) {
    super(props);
  }

  handleDirectMessage = async () => {
    const dispatch = window.store.dispatch;
    const result = await ChannelActions.createDirectChannel(this.props.user.id, this.props.cur_user.id)(dispatch, this.props.state);

    await this.props.actions.startMeeting(result.data.id, "", this.props.cur_user.username + " " + this.props.user.username);

  }

  render() {
    const style = getStyle(this.props.theme);
    const user = this.props.user;

    const myteam = this.props.teamname
    const url = '/' + myteam + '/messages/@' + user.username

    return (<div style={{
        ...style.container,
        left: this.props.positionLeft,
        top: this.props.positionTop
      }}>
      <h3 style={style.title}>
        <a>{user.username}</a>
      </h3>
      <div style={style.content}>
        <img style={style.img} src={this.props.src}/>
        <div style={style.fullName}>
          {user.first_name + ' ' + user.last_name}
        </div>
        <hr style={{
            margin: '10px -15px 10px'
          }}/> {
          this.props.user.id != this.props.cur_user.id && <div>
              <Link to={url} onClick={this.handleDirectMessage}>
                <i className='fa fa-video-camera'/>{'  Start BigBlueButton Meeting'}
              </Link>
              <br/>
            </div>
        }
        <Link to={url}>
          <i className='fa fa-paper-plane'/>{' Send Message'}
        </Link>
      </div>
    </div>);
  }
}

/* Define CSS styles here */
const getStyle = makeStyleFromTheme((theme) => {
  return {
    container: {
      backgroundColor: theme.centerChannelBg,
      position: 'absolute',
      border: '1px solid ' + changeOpacity(theme.centerChannelColor, 0.2),
      borderRadius: '4px',
      zIndex: 9999 // Bring popover to top
    },
    title: {
      padding: '8px 14px',
      margin: '0',
      fontSize: '14px',
      backgroundColor: changeOpacity(theme.centerChannelBg, 0.2),
      borderBottom: '1px solid #ebebeb',
      borderRadius: '5px 5px 0 0'
    },
    content: {
      padding: '9px 14px'
    },
    img: {
      verticalAlign: 'middle',
      maxWidth: '100%',
      borderRadius: '128px',
      margin: '0 0 10px'
    },
    fullName: {
      overflow: 'hidden',
      paddingBottom: '7px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  };
});
