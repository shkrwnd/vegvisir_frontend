/**
=========================================================
* UserCard Component
=========================================================
* Feature-specific component for displaying user card
*/

import PropTypes from "prop-types";
import MKBox from "components/base/MKBox";
import MKAvatar from "components/base/MKAvatar";
import MKTypography from "components/base/MKTypography";
import MKBadge from "components/base/MKBadge";
import { getStatusColor } from "core/utils";

function UserCard({ user, onClick }) {
  return (
    <MKBox
      p={2}
      borderRadius="lg"
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              boxShadow: 3,
              transform: "translateY(-2px)",
              transition: "all 0.2s",
            }
          : {},
      }}
      onClick={onClick}
    >
      <MKBox display="flex" alignItems="center" gap={2}>
        <MKAvatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "primary.main",
          }}
        >
          {user.name?.charAt(0) || "U"}
        </MKAvatar>
        <MKBox flex={1} minWidth={0}>
          <MKTypography variant="h6" fontWeight="medium" noWrap>
            {user.name}
          </MKTypography>
          <MKTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
            {user.email}
          </MKTypography>
        </MKBox>
        {user.status && (
          <MKBadge
            variant="contained"
            badgeContent={user.status}
            color={getStatusColor(user.status)}
            size="xs"
          />
        )}
      </MKBox>
    </MKBox>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default UserCard;
